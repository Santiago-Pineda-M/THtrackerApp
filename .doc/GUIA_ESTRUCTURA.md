# Guía de Estructura y Organización del Proyecto

Este proyecto sigue los principios de **Clean Architecture** adaptados para un entorno Frontend moderno (PWA), utilizando el **Patrón Ploc** para la gestión del estado y la lógica de presentación.

---

## 🏗️ Directorio Raíz del Código (`src/`)

### 1. `Domain/` (Capa de Dominio)
Es el núcleo de la aplicación. No depende de ninguna otra capa ni de librerías externas.
- **`Entities/`**: Objetos de negocio puros (ej. `User`, `Tracker`).
- **`Interfaces/`**: Contratos que la infraestructura debe implementar (ej. `IHttpClient`, `IStorage`).
- **`Auth/`**: Entidades y tipos específicos del módulo de autenticación.
- **`Ploc.ts`**: Clase base abstracta para todos los controladores de estado.

### 2. `Application/` (Capa de Aplicación)
Contiene la lógica de negocio específica de la aplicación organizada en casos de uso.
- **Estructura**: `Application/{Modulo}/{UseCaseName}UseCase.ts`.
- **Regla**: Solo puede importar de `Domain`.
- **`Auth/`**: Casos de uso como `LoginUseCase`, `RegisterUseCase`.

### 3. `Controllers/` (Capa de Controladores / Plocs)
Gestiona el estado de la UI. Actúa como mediador entre la UI y la Capa de Aplicación.
- **Estructura**: `Controllers/{Modulo}/{Modulo}Ploc.ts`.
- **Regla**: Gestiona el estado observable al que se suscriben los componentes.

### 4. `Infrastructure/` (Capa de Infraestructura)
Contiene los "detalles" técnicos. Es la capa más externa y volátil.
- **`Adapters/`**: Implementaciones reales de las interfaces del dominio (ej. `FetchHttpClient`, `SecureStorageAdapter`).
- **`DI/`**: Localizador de dependencias (`DependenciesLocator.ts`). Único punto de instanciación.
- **`Hooks/`**: Hooks de React que vinculan Plocs con componentes (ej. `usePlocState`).
- **`UI/`**:
    - **`components/`**: Componentes reutilizables (`shared`, `layout`, `auth`).
    - **`pages/`**: Vistas completas de la aplicación.
    - **`router/`**: Configuración de rutas (`AppRouter.tsx`).

---

## 🧪 Pruebas (`__tests__/`)
Ubicados en la raíz del proyecto para mantener `src/` limpio de archivos de test. Espeja la estructura de `src/`.

---

## 📜 Reglas de Organización Futura

### 1. Creación de una Nueva Funcionalidad (Feature)
Para añadir un nuevo módulo (ej. "Trackers"):
1.  **Dominio**: Define la entidad en `Domain/Entities/Tracker.ts` y las interfaces necesarias en `Domain/Interfaces/`.
2.  **Aplicación**: Crea los casos de uso en `Application/Trackers/`.
3.  **Controladores**: Implementa el `TrackerPloc.ts` en `Controllers/Trackers/`.
4.  **Infraestructura**:
    - Si requiere un nuevo adaptador, añádelo en `Infrastructure/Adapters/`.
    - Registra el nuevo Ploc y sus Use Cases en `Infrastructure/DI/DependenciesLocator.ts`.
    - Crea los componentes y la página en `Infrastructure/UI/`.
    - Añade la ruta en `Infrastructure/UI/router/AppRouter.tsx`.

### 2. Barrel Files (`index.ts`)
Cada directorio de nivel superior y de módulo debe tener un `index.ts` para facilitar las importaciones.
- **NUNCA** hagas importaciones profundas (ej. `import { X } from '../../Application/Auth/LoginUseCase'`).
- **SIEMPRE** usa el barrel (ej. `import { LoginUseCase } from '../../Application/Auth'`).

### 3. Dependencias Circulares
- `Infrastructure` → importa TODO.
- `Controllers` → importa `Domain` y `Application`.
- `Application` → importa `Domain`.
- `Domain` → **NO IMPORTA NADA**.

### 4. Nomenclatura
- Clases/Interfaces: `PascalCase`.
- Archivos: `PascalCase` para componentes y clases, `camelCase` para utilidades/hooks.
- Casos de Uso: Sufijo `UseCase` (ej. `CreateTrackerUseCase.ts`).
- Controladores: Sufijo `Ploc` (ej. `TrackerPloc.ts`).
