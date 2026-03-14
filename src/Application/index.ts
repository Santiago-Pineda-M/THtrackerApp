/**
 * APPLICATION LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Aplicación.
 */

// Health UseCases
export { GetHealthUseCase } from './Health/GetHealthUseCase';

// Auth UseCases (estructura nueva según documentación)
export * from './AuthUsesCase';

// Auth UseCases (estructura original - manteniendo compatibilidad)
export * from './Auth';

// Interfaces de Servicios
export * from './Interfaces/IServices/IAuthService';
