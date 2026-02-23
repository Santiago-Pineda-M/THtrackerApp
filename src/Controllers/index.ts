/**
 * CONTROLLERS LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Controllers (Plocs).
 */
export { HealthPloc } from './Health/HealthPloc';
export type { IHealthState } from './Health/HealthPloc';

export { AuthPloc } from './Auth/AuthPloc';
export * from './Auth/IAuthState';
