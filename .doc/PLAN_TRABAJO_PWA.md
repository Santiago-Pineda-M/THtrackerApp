# Plan de Trabajo: PWA con Clean Architecture + Ploc Pattern

---

## ✅ Fase 1: Setup Inicial y Configuración PWA — COMPLETADA

- [x] Inicializar proyecto con **Vite + TypeScript + React**.
- [x] Configurar el plugin de PWA (`vite-plugin-pwa`).
- [x] Definir el manifiesto en `vite.config.ts` (nombre, iconos, colores).
- [x] Configurar Service Worker con `autoUpdate`.
- [x] Estructurar carpetas base siguiendo Clean Architecture.

---

## ✅ Fase 2: Implementación del Core (Dominio) — COMPLETADA

- [x] Crear la clase abstracta `Domain/Ploc.ts` (Patrón Observer).
- [x] Definir `Domain/Interfaces/IUseCase.ts` (contrato de casos de uso).
- [x] Definir `Domain/Interfaces/IHttpClient.ts` (contrato HTTP).
- [x] Definir `Domain/Interfaces/IStorage.ts` (contrato de almacenamiento).

---

## ✅ Fase 3: Infraestructura y Adaptadores — COMPLETADA

- [x] Implementar `FetchHttpClient` usando la Fetch API nativa.
- [x] Crear `DependenciesLocator.ts` para Inyección de Dependencias.
- [x] Crear el hook `usePlocState.ts` para vincular React con los Plocs.
- [x] Crear `AppRouter.tsx` como punto centralizado de rutas.
- [x] Implementar `LocalStorageAdapter` para preferencias y caché.
- [x] Implementar `SecureStorageAdapter` (AES-GCM) para tokens de auth.

---

## 🔄 Fase 4: Autenticación (Auth Module) — EN PROGRESO

Ver `swagger.json` para los contratos exactos de la API.

- [ ] `Application/Auth/LoginUseCase.ts`       → POST `/api/v1/auth/login`
- [ ] `Application/Auth/RegisterUseCase.ts`    → POST `/api/v1/auth/register`
- [ ] `Application/Auth/GoogleLoginUseCase.ts` → GET  `/api/v1/auth/google`
- [ ] `Application/Auth/RefreshTokenUseCase.ts`
- [ ] `Controllers/Auth/LoginPloc.ts`
- [ ] `Controllers/Auth/RegisterPloc.ts`
- [ ] `Infrastructure/UI/pages/auth/LoginPage.tsx`
- [ ] `Infrastructure/UI/pages/auth/RegisterPage.tsx`
- [ ] Rutas en `AppRouter.tsx`: `/login`, `/register`, `/auth/callback`
- [ ] Guard de ruta autenticada (PrivateRoute)

---

## ⏳ Fase 5: Dashboard y Features Principales

- [ ] `Application/Dashboard/` → Casos de uso de datos del dashboard
- [ ] `Controllers/Dashboard/DashboardPloc.ts`
- [ ] `Infrastructure/UI/pages/dashboard/DashboardPage.tsx`
- [ ] Implementar layout principal (`AppShell`, `Header`, `Sidebar`)

---

## ⏳ Fase 6: Componentes UI Compartidos

- [ ] `Infrastructure/UI/components/shared/Button.tsx`
- [ ] `Infrastructure/UI/components/shared/Input.tsx`
- [ ] `Infrastructure/UI/components/shared/Spinner.tsx`
- [ ] `Infrastructure/UI/components/shared/Alert.tsx`
- [ ] `Infrastructure/UI/components/layout/AuthLayout.tsx`
- [ ] `Infrastructure/UI/components/layout/AppShell.tsx`

---

## ⏳ Fase 7: Optimización PWA y Despliegue

- [ ] Auditar con Lighthouse (Performance, PWA, Accessibility).
- [ ] Estrategia de caché avanzada para Workbox.
- [ ] Prompt de "Nueva versión disponible" (ya implementado parcialmente).
- [ ] Configurar scripts de despliegue.
