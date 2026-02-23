/**
 * UI LAYER - Auth Pages
 * ─────────────────────────────────────────────────────────────────────────────
 * Pantallas de autenticación. Cada pantalla:
 *   1. Instancia su Ploc via dependenciesLocator
 *   2. Usa usePlocState() para suscribirse al estado
 *   3. Delega toda la lógica al Ploc (nunca lógica de negocio aquí)
 *
 * Pantallas a implementar:
 *   - LoginPage.tsx       → /login
 *   - RegisterPage.tsx    → /register
 *   - GoogleCallback.tsx  → /auth/callback (manejador de OAuth redirect)
 */

export { LoginPage } from './LoginPage';
export { RegisterPage } from './RegisterPage';
