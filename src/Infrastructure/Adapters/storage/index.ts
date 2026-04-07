/**
 * INFRASTRUCTURE LAYER - Storage Adapters
 * ─────────────────────────────────────────────────────────────────────────────
 * Implementaciones concretas del contrato IStorage.
 *
 *  - LocalStorageAdapter   → localStorage sincrónico (~5MB). Sin cifrado.
 *                            Usar para: preferencias, tema, idioma, caché offline.
 *
 *  - SecureStorageAdapter  → localStorage + cifrado AES-GCM 256-bit (Web Crypto API).
 *                            Asíncrono. Usar para: tokens JWT, refresh tokens, datos sensibles.
 */
export { LocalStorageAdapter } from './LocalStorageAdapter'
export { SecureStorageAdapter } from './SecureStorageAdapter'
