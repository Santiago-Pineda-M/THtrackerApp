# Ejemplos de Código: Clean Architecture + Ploc Pattern

Este documento contiene ejemplos prácticos de las estructuras clave, aplicando **Clean Code** (Single Responsibility, Inyección de Dependencias, Nombres descriptivos).

---

## 1. Patrón Observer Base (`Domain/Ploc.ts`)
Esta clase es la base de toda la lógica de presentación. No depende de React.

```typescript
type Subscription<S> = (state: S) => void;

export abstract class Ploc<S> {
  private internalState: S;
  private listeners: Subscription<S>[] = [];

  constructor(initialState: S) {
    this.internalState = initialState;
  }

  public get state(): S {
    return this.internalState;
  }

  protected changeState(state: S) {
    this.internalState = state;
    this.listeners.forEach((listener) => listener(this.state));
  }

  public subscribe(listener: Subscription<S>) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: Subscription<S>) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}
```

---

## 2. Definición del Caso de Uso (`Application/IUseCase.ts`)
Cada acción de negocio es una clase.

```typescript
// Interface base
export interface IUseCase<I, O> {
  execute(input: I): Promise<O>;
}

// Ejemplo: Caso de uso de Registro
export class RegisterUseCase implements IUseCase<RegisterRequest, RegisterResponse> {
  constructor(private readonly httpClient: IHttpClient) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    // Lógica de negocio/orquestación
    const response = await this.httpClient.post('/auth/register', request);
    return response.data;
  }
}
```

---

## 3. Lógica de Presentación (`Controllers/RegisterPloc.ts`)
Gestiona el estado de una pantalla específica.

```typescript
export interface RegisterState {
  email: string;
  isLoading: boolean;
  error?: string;
}

export class RegisterPloc extends Ploc<RegisterState> {
  constructor(private readonly registerUseCase: RegisterUseCase) {
    super({ email: '', isLoading: false });
  }

  async register(email: string) {
    this.changeState({ ...this.state, isLoading: true });

    try {
      await this.registerUseCase.execute({ email });
      this.changeState({ ...this.state, isLoading: false });
    } catch (e) {
      this.changeState({ ...this.state, isLoading: false, error: 'Error al registrar' });
    }
  }
}
```

---

## 4. Hook de Vinculación con React (`Infrastructure/usePlocState.ts`)
Permite que React se re-renderice cuando el Ploc cambia.

```typescript
import { useEffect, useState } from 'react';
import { Ploc } from '../Domain/Ploc';

export function usePlocState<S>(ploc: Ploc<S>) {
  const [state, setState] = useState(ploc.state);

  useEffect(() => {
    const listener = (newState: S) => setState(newState);
    ploc.subscribe(listener);
    
    return () => ploc.unsubscribe(listener);
  }, [ploc]);

  return state;
}
```

---

## 5. Inyección de Dependencias (`Infrastructure/DependenciesLocator.ts`)
El único lugar donde se instancian las clases.

```typescript
// Adaptadores
const httpClient = new FetchHttpClient(API_URL);

// Casos de Uso
const registerUseCase = new RegisterUseCase(httpClient);

// Plocs
export const dependenciesLocator = {
  provideRegisterPloc: () => new RegisterPloc(registerUseCase),
};
```

---

## 6. Componente de UI (React)
Limpio de lógica, solo renderiza según el estado del Ploc.

```tsx
export const RegisterScreen = () => {
  const ploc = useMemo(() => dependenciesLocator.provideRegisterPloc(), []);
  const state = usePlocState(ploc);

  return (
    <div>
      {state.isLoading && <p>Cargando...</p>}
      <input 
        onChange={(e) => ploc.updateEmail(e.target.value)} 
        placeholder="Email" 
      />
      <button onClick={() => ploc.register(state.email)}>
        Registrar
      </button>
      {state.error && <span>{state.error}</span>}
    </div>
  );
};
```
