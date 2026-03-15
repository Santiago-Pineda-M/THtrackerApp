/**
 * APPLICATION LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Aplicación.
 */

// Health UseCases
export { GetHealthUseCase } from './UseCases/Health/GetHealthUseCase';

// Auth UseCases (estructura nueva según documentación)
export * from './UseCases/Auth';

// Auth DTOs
export * from './DTOs/Auth/AuthDTOs';

// Interfaces de Servicios
export * from './Services/Auth/IAuthService';
