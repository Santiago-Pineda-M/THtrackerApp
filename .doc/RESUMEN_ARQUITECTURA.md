# Resumen de Arquitectura: Clean Architecture + Ploc Pattern

Esta arquitectura se basa en **Clean Architecture** (Robert C. Martin) adaptada para frontend (Web PWA) usando el patrón **Ploc (Presentation Logic Component)** como capa de controladores.

---

## 🎯 Objetivos de la Arquitectura

1. **Independencia del Framework:** La lógica de negocio no depende de React.
2. **Testabilidad:** Tests unitarios sobre la lógica sin renderizar componentes.
3. **Mantenibilidad:** Separación clara de responsabilidades.
4. **Escalabilidad:** Añadir features sin afectar las existentes.

---

## 🏗️ Capas del Proyecto (Estructura Real)

```
src/
├── Domain/                          ← Capa más interna (sin dependencias)
│   ├── Ploc.ts                      ← Clase base Observer (core del patrón)
│   ├── Interfaces/
│   │   ├── IUseCase.ts              ← Contrato base para casos de uso
│   │   ├── IHttpClient.ts           ← Contrato para cliente HTTP
│   │   └── IStorage.ts             ← Contrato para almacenamiento local
│   └── index.ts                    ← Barrel exports
│
├── Application/                     ← Lógica de negocio específica
│   ├── Health/
│   │   └── GetHealthUseCase.ts
│   ├── Auth/
│   │   └── index.ts                ← (LoginUseCase, RegisterUseCase...)
│   └── index.ts                    ← Barrel exports
│
├── Controllers/                     ← Estado de la UI (Plocs), TypeScript puro
│   ├── Health/
│   │   └── HealthPloc.ts
│   ├── Auth/
│   │   └── index.ts                ← (LoginPloc, RegisterPloc...)
│   └── index.ts                    ← Barrel exports
│
└── Infrastructure/                  ← Detalles de implementación y UI
    ├── Adapters/
    │   ├── http/
    │   │   └── FetchHttpClient.ts   ← Implementa IHttpClient con fetch
    │   └── storage/
    │       └── index.ts             ← (LocalStorageAdapter...)
    ├── DI/
    │   └── DependenciesLocator.ts   ← Service Locator (única instanciación)
    ├── Hooks/
    │   └── usePlocState.ts          ← Hook React que vincula Ploc ↔ componente
    ├── PWA/
    │   └── ReloadPrompt.tsx         ← Prompt de actualización del SW
    ├── UI/
    │   ├── components/
    │   │   ├── shared/              ← Button, Input, Spinner, Card, Modal...
    │   │   └── layout/             ← AppShell, Header, Sidebar, AuthLayout...
    │   ├── pages/
    │   │   ├── health/
    │   │   │   └── HealthStatus.tsx
    │   │   ├── auth/               ← LoginPage, RegisterPage...
    │   │   └── dashboard/          ← DashboardPage...
    │   └── router/
    │       └── AppRouter.tsx        ← Configuración centralizada de rutas
    └── index.ts                    ← Barrel exports
```

---

## 🔄 Flujo de Datos (Data Flow)

```
Componente React
    │ (1) Acción del usuario (click/submit)
    ▼
Ploc (Controllers/)
    │ (2) changeState({ isLoading: true })
    │ (3) Llama al Use Case
    ▼
Use Case (Application/)
    │ (4) Orquesta la lógica, llama al adaptador
    ▼
Adapter (Infrastructure/Adapters/)
    │ (5) Hace la llamada HTTP real
    ▼
API Backend
    │
    ▼ (respuesta)
Use Case → Ploc → changeState(resultado)
    │
    ▼
usePlocState (Hooks/)
    │ (6) Re-renderiza el componente automáticamente
    ▼
Componente React (muestra el nuevo estado)
```

---

## 📏 Reglas de Dependencias

- `Domain` → no importa nada de otras capas
- `Application` → importa solo de `Domain`
- `Controllers` → importa de `Domain` y `Application`
- `Infrastructure` → importa de todas las capas (es la externa)
- **NUNCA** importar `Infrastructure` desde `Domain`, `Application` o `Controllers`
