# Arquitectura DDD - THtrackerApp

## Resumen

Este documento establece las reglas y convenciones para el desarrollo del proyecto THtrackerApp. Toda nueva funcionalidad debe seguir estas reglas.

---

## 1. Reglas de Capas

### 1.1 Estructura de Capas

```
UI (React) → Controllers (Plocs) → Application (UseCases) → Domain ← Infrastructure
```

**Dirección de dependencias:** Solo de izquierda a derecha. Infrastructure puede depender de todas.

### 1.2 Definición de Capas

| Capa | Responsabilidad | Ejemplos |
|------|----------------|----------|
| **Domain** | Entidades, value objects, interfaces de estados, interfaces de repositorios | AuthSession, Email, IAuthState |
| **Application** | Casos de uso, DTOs, validadores, mapeadores | LoginUseCase, LoginRequestDTO |
| **Controllers** | Gestión de estado reactivo (Plocs) | AuthPloc, DebugPloc |
| **Infrastructure** | Implementaciones, adaptadores, UI, hooks | FetchHttpClient, useAuth |

---

## 2. Reglas de Nomenclatura

### 2.1 Por Tipo de Elemento

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| **Entidad** | `{Nombre}.ts` | `AuthSession.ts` |
| **Value Object** | `{Nombre}.ts` | `Email.ts` |
| **Interfaz de Estado** | `I{Nombre}State.ts` | `IAuthState.ts` |
| **Interfaz Genérica** | `I{Nombre}.ts` | `IUseCase.ts` |
| **UseCase** | `{Accion}{Entidad}UseCase.ts` | `LoginUseCase.ts` |
| **DTO Entrada** | `{Accion}Request.ts` | `LoginRequest.ts` |
| **DTO Salida** | `{Accion}Response.ts` | `LoginResponse.ts` |
| **Ploc** | `{Nombre}Ploc.ts` | `AuthPloc.ts` |
| **Hook** | `use{nombre}.ts` | `useAuth.ts` |
| **Componente** | `{Nombre}.tsx` | `DebugPanel.tsx` |
| **Constantes** | `UPPER_SNAKE_CASE.ts` | `API_ENDPOINTS.ts` |

### 2.2 Reglas de Placement por Capa

```
src/
├── Domain/
│   ├── {Modulo}/
│   │   ├── {Entidad}.ts
│   │   ├── {ValueObject}.ts
│   │   ├── I{Estado}State.ts     ← Estados van aquí
│   │   └── index.ts
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Interfaces/
│   └── Repositories/
│
├── Application/
│   ├── {Modulo}/
│   │   ├── UseCases/
│   │   │   └── {Accion}UseCase.ts
│   │   ├── DTOs/
│   │   │   └── {Accion}Request.ts
│   │   └── Validators/
│   └── index.ts
│
├── Controllers/
│   ├── {Modulo}/
│   │   ├── {Modulo}Ploc.ts       ← Plocs van aquí
│   │   └── index.ts
│   └── index.ts
│
└── Infrastructure/
    ├── Adapters/
    ├── Repositories/
    ├── Services/
    └── UI/
        ├── components/
        │   ├── {modulo}/
        │   │   ├── {Componente}.tsx
        │   │   └── use{Feature}.ts
        │   └── shared/
        ├── pages/
        ├── hooks/
        └── DI/
```

---

## 3. Reglas de Implementación

### 3.1 Entity (Domain)

```typescript
// ✅ Reglas:
// - Constructor privado
// - Factory method estático
// - Props inmutables (Object.freeze)
// - Métodos de dominio puros

export interface AuthSessionProps {
    readonly userId: string;
    readonly email: string;
    readonly accessToken: string;
    readonly expiresAt: number;
}

export class AuthSession {
    private readonly props: AuthSessionProps;
    
    private constructor(props: AuthSessionProps) {
        this.props = Object.freeze(props);
    }
    
    static create(data: AuthSessionData): AuthSession {
        return new AuthSession({ ...data });
    }
    
    isExpired(): boolean {
        return Date.now() > this.props.expiresAt * 1000;
    }
}
```

### 3.2 Interfaz de Estado (Domain)

```typescript
// ✅ Reglas:
// - Definida en Domain/{Modulo}/
// - Nombre: I{Modulo}State.ts
// - Solo tipos, sin lógica
// - Exportada desde index.ts del módulo

import { AuthStatus } from '../AuthStatus';

export interface IAuthState {
    readonly status: AuthStatus;
    readonly user?: IUserSession;
    readonly error?: string;
}

export const initialAuthState: IAuthState = {
    status: AuthStatus.IDLE
};
```

### 3.3 UseCase (Application)

```typescript
// ✅ Reglas:
// - Implementa IUseCase<I, O>
// - Dependencias son abstracciones (interfaces)
// - Sin dependencias de React/UI
// - Una responsabilidad por caso de uso

export interface IUseCase<I, O> {
    execute(input: I): Promise<O>;
}

export class LoginUseCase implements IUseCase<LoginRequest, LoginResponse> {
    constructor(
        private readonly authService: IAuthService,      // ✅ Abstracción
        private readonly sessionRepo: IAuthSessionRepository  // ✅ Abstracción
    ) {}
    
    async execute(input: LoginRequest): Promise<LoginResponse> {
        // Orchestración pura
    }
}
```

### 3.4 Ploc (Controllers)

```typescript
// ✅ Reglas:
// - Extiende clase base Ploc
// - Recibe UseCases por inyección
// - NO tiene lógica de negocio (delega a UseCases)
// - Solo gestión de estado

export class AuthPloc extends Ploc<IAuthState> {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly logoutUseCase: LogoutUseCase
    ) {
        super(initialAuthState);
    }
    
    async login(credentials: LoginRequest): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.AUTHENTICATING });
        
        const result = await this.loginUseCase.execute(credentials);
        
        this.changeState({
            status: AuthStatus.AUTHENTICATED,
            user: result.user
        });
    }
}
```

---

## 4. Reglas de Logging

### 4.1 Console.log

```typescript
// ✅ Regla: Solo en desarrollo
if (import.meta.env.DEV) {
    console.log('[Modulo] Acción: detalle');
}

// ❌ Prohibido en producción
console.log('[Modulo] Acción: detalle');

// ❌ Prohibido: datos sensibles
console.log('User:', user.password);
```

---

## 5. Reglas de Debug Panel

### 5.1 Flujo de Datos

```
UI (useDebugInfo) 
    → DebugPloc (Controllers) 
        → GetDebugInfoUseCase (Application) 
            → IDebugState (Domain)
            → AuthSessionRepository
```

### 5.2 Reglas Específicas

- ✅ **Estado:** Definido en `Domain/Debug/I{Modulo}State.ts`
- ✅ **UseCase:** En `Application/Debug/{Accion}DebugUseCase.ts`
- ✅ **Ploc:** En `Controllers/Debug/{Modulo}Ploc.ts`
- ✅ **UI:** NO accede a Repository directamente
- ✅ **Actualización:** Ploc gestiona setInterval
- ✅ **Cleanup:** stopUpdating() limpia recursos

---

## 6. Reglas de Imports

### 6.1 Prohibidos

```typescript
// ❌ Domain no puede importar de Application/Controllers/Infrastructure
import { LoginUseCase } from '../../Application/UseCases';

// ❌ Application no puede importar de Controllers/Infrastructure
import { AuthPloc } from '../../Controllers';

// ❌ Controllers no puede importar de Infrastructure/Adapters
import { FetchHttpClient } from '../Adapters/http';
```

### 6.2 Permitidos

```typescript
// ✅ Domain → Domain
import { AuthSession } from '../Entities';

// ✅ Application → Domain + propios DTOs
import { IUseCase } from '../../Domain/Interfaces';
import { LoginRequest } from '../DTOs';

// ✅ Controllers → Domain + Application
import { IAuthState } from '../../Domain/Auth/IAuthState';
import { LoginUseCase } from '../../Application/UseCases/Auth';

// ✅ Infrastructure → Todas las capas
import { AuthPloc } from '../../Controllers/Auth';
import { LoginUseCase } from '../../Application/UseCases/Auth';
import { AuthSession } from '../../Domain/Entities';
```

---

## 7. Checklist de Verificación

Antes de hacer commit:

```bash
# ¿El estado está en Domain?
# ¿El UseCase implementa IUseCase?
# ¿El Ploc extiende Ploc?
# ¿Los imports respetan las capas?
# ¿console.log es condicional?
```

---

## 8. Resumen de Reglas

| Categoría | Regla |
|-----------|-------|
| **Estados** | Domain/{Modulo}/I{Modulo}State.ts |
| **UseCases** | Application/{Modulo}/UseCases/{Accion}UseCase.ts |
| **Plocs** | Controllers/{Modulo}/{Modulo}Ploc.ts |
| **Hooks** | Infrastructure/UI/components/{modulo}/use{Feature}.ts |
| **Dependencias** | Solo hacia capas inferiores |
| **Logging** | Solo con import.meta.env.DEV |
| **Entity** | Constructor privado + factory |
| **UseCase** | Implementa IUseCase |
| **Naming** | Ver tabla sección 2.1 |
