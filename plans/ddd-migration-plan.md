# Plan de Migración DDD Completo

## Estado Actual (Análisis)

### Problemas Identificados

| Problema                                | Ubicación Actual                              | Capa           |
| --------------------------------------- | --------------------------------------------- | -------------- |
| Validación HTTP duplicada               | `Application/Auth/HttpResponseValidator.ts`   | Application    |
| Request DTOs fragmentados               | `AuthDTOs.ts`, `IAuthRequest.ts`              | App + Domain   |
| Response DTOs duplicados                | `IAuthResponses.ts`, `IAuthResponsesError.ts` | Domain         |
| IAuthToken en Domain + storage paralelo | Domain + FetchHttpClient                      | Domain + Infra |
| Entidades sin validación de dominio     | Poca validación en entidades                  | Domain         |

---

## Arquitectura DDD Objetivo

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOMAIN (Núcleo)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  Entities    │  │ Value Objects │  │ Domain Services    │ │
│  │ (AuthSession)│  │ (Email,Token) │  │ (AuthValidator)    │ │
│  └──────────────┘  └──────────────┘  └────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Repositories (Interfaces) - No implementación            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  Use Cases   │  │    DTOs      │  │  Input Validators  │ │
│  │              │  │ (Mappers)    │  │ (Zod/ClassValidator)│
│  └──────────────┘  └──────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │Repositories  │  │  Adapters    │  │   Storage          │ │
│  │(Implementations)│ │ (HTTP,Email)│  │ (Local,Secure)    │ │
│  └──────────────┘  └──────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Plan de Migración por Fases

### Fase 1: Normalizar Requests/Responses (Día 1)

**Objetivo:** Unificar definiciones de Request/Response en Domain

#### 1.1 Crear Value Objects en Domain

```typescript
// src/Domain/ValueObjects/Email.ts
export class Email {
  private constructor(private readonly value: string) {}
  static create(email: string): Email {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new Error('Email inválido');
    }
    return new Email(email);
  }
  toString(): string {
    return this.value;
  }
}

// src/Domain/ValueObjects/AuthTokens.ts
export class AuthTokens {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresAt: Date
  ) {}

  isExpired(): boolean {
    return Date.now() >= this.expiresAt.getTime();
  }
}
```

#### 1.2 Consolidar AuthRequests

```typescript
// src/Domain/Requests/AuthRequests.ts
export interface LoginRequest {
  email: Email;
  password: Password;
  deviceInfo: string;
}

export interface RegisterRequest {
  name: string;
  email: Email;
  password: Password;
}
```

#### 1.3 Consolidar AuthResponses

```typescript
// src/Domain/Responses/AuthResponses.ts
export type AuthResult = AuthSuccess | AuthFailure;

export interface AuthSuccess {
  readonly tokens: AuthTokens;
  readonly user: User;
}

export interface AuthFailure {
  readonly error: AuthError;
}
```

---

### Fase 2: Mover Validación a Domain (Día 2)

**Objetivo:** Que la validación viva en el dominio, no en Application

#### 2.1 Crear Domain Services para Validación

```typescript
// src/Domain/Services/AuthValidationService.ts
export class AuthValidationService {
  validateLoginRequest(input: unknown): ValidationResult<LoginRequest> {
    // Usar Zod o class-validator
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      deviceInfo: z.string().optional(),
    });

    return this.validate(schema, input);
  }

  private validate<T>(schema: ZodSchema, input: unknown): ValidationResult<T> {
    const result = schema.safeParse(input);
    if (!result.success) {
      return { valid: false, errors: result.error.errors };
    }
    return { valid: true, value: result.data };
  }
}
```

#### 2.2 Crear Entidades con Validación

```typescript
// src/Domain/Entities/User.ts
export class User {
  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly name: string,
    public readonly role: UserRole
  ) {}

  static create(props: UserProps): User {
    // Validación de dominio
    if (!props.name || props.name.trim().length === 0) {
      throw new DomainException('Name is required');
    }
    return new User(props);
  }
}
```

---

### Fase 3: Unificar Persistencia (Día 3)

**Objetivo:** Un storage = una representación de entidad

#### 3.1 Eliminar almacenamiento paralelo

**PROBLEMA ACTUAL:**

- `SecureStorageAdapter` guarda `auth_session` (AuthSession)
- `LocalStorageAdapter` guarda `auth_token` (tokens sueltos)

**SOLUCIÓN:**

- Solo guardar `AuthSession` en SecureStorage
- El HTTP Client lee de AuthSessionRepository

```typescript
// src/Infrastructure/Repositories/AuthSessionRepository.ts
export class AuthSessionRepository implements IAuthSessionRepository {
  constructor(private readonly secureStorage: ISecureStorage) {}

  async getSession(): Promise<AuthSession | null> {
    const data = await this.secureStorage.get('auth_session');
    if (!data) return null;
    return AuthSession.fromJSON(data);
  }

  async saveSession(session: AuthSession): Promise<void> {
    await this.secureStorage.set('auth_session', session.toJSON());
  }
}

// FetchHttpClient lee del repositorio, no de storage directo
export class FetchHttpClient implements IHttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly sessionRepo: IAuthSessionRepository // ← Nuevo
  ) {}

  private async getToken(): Promise<string | null> {
    const session = await this.sessionRepo.getSession();
    return session?.accessToken ?? null;
  }
}
```

#### 3.2 Eliminar duplicación LocalStorage + SecureStorage

**ANTES:**

- `LocalStorageAdapter` - para tokens HTTP
- `SecureStorageAdapter` - para sesión

**DESPUÉS:**

- Un solo `StorageAdapter` con interfaz unificada
- Distinguir por namespace/key

---

### Fase 4: Limpiar Application Layer (Día 4)

**Objetivo:** Application solo orquesta, no valida

#### 4.1 Use Cases Simplificados

```typescript
// src/Application/Auth/LoginUseCase.ts
export class LoginUseCase implements IUseCase<LoginRequest, AuthResult> {
  constructor(
    private readonly authService: IAuthService,
    private readonly validationService: AuthValidationService,
    private readonly sessionRepo: IAuthSessionRepository
  ) {}

  async execute(input: LoginRequest): Promise<AuthResult> {
    // 1. Validar (delegate a Domain)
    const validation = this.validationService.validateLoginRequest(input);
    if (!validation.valid) {
      return { error: validation.errors };
    }

    // 2. Ejecutar (delegate a Infrastructure)
    const result = await this.authService.login(validation.value);

    // 3. Persistir (delegate a Infrastructure)
    if (isSuccess(result)) {
      await this.sessionRepo.saveSession(result.session);
    }

    return result;
  }
}
```

#### 4.2 Eliminar HttpResponseValidator de Application

- Mover a Domain ValidationService
- Application solo recibe resultados limpios

---

### Fase 5: Consolidar Tests (Día 5)

**Objetivo:** Tests reflejan la arquitectura DDD

| Test Type   | Ubicación      | Qué prueba                           |
| ----------- | -------------- | ------------------------------------ |
| Unit Tests  | `Domain/`      | Entidades, Value Objects, Validación |
| Integration | `Application/` | Use Cases con mocks                  |
| E2E         | `__tests__/`   | Flujos completos                     |

---

## Checklist de Migración

- [ ] **Fase 1:** Crear Value Objects (Email, Password, AuthTokens)
- [ ] **Fase 1:** Consolidar Requests/Responses en Domain
- [ ] **Fase 2:** Crear AuthValidationService en Domain
- [ ] **Fase 2:** Añadir validación a entidades existentes
- [ ] **Fase 3:** Unificar storage (eliminar auth_token paralelo)
- [ ] **Fase 3:** FetchHttpClient usa AuthSessionRepository
- [ ] **Fase 4:** Simplificar Use Cases (solo orquestación)
- [ ] **Fase 4:** Eliminar HttpResponseValidator de Application
- [ ] **Fase 5:** Reorganizar tests por capa DDD
- [ ] **Fase 5:** Tests de validación en Domain

---

## Archivos a Crear/Modificar

### Nuevos archivos

```
src/Domain/
├── ValueObjects/
│   ├── Email.ts
│   ├── Password.ts
│   ├── AuthTokens.ts
│   └── UserId.ts
├── Services/
│   └── AuthValidationService.ts
└── Exceptions/
    └── DomainException.ts

src/Application/
├── Validators/
│   └── InputValidators.ts  (si es necesario)
└── DTOs/ (eliminar duplicados)
```

### Archivos a eliminar

- `src/Application/Auth/HttpResponseValidator.ts` (mover validación)
- `src/Infrastructure/Adapters/storage/auth_token` (unificar storage)
- Duplicados en Request/Response interfaces

---

## Nota sobre elbug resuelto

El bug de `expiresAt: null` se solucionó añadiendo fallback:

```typescript
expiresAt: Date.now() + (result.expiresIn || 3600) * 1000;
```

**Solución correcta:** El API debe devolver `expiresIn` o usar el JWT `exp` claim como fallback.
