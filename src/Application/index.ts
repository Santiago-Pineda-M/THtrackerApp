/**
 * APPLICATION LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Aplicación.
 */

// Auth UseCases (estructura nueva según documentación)
export * from './UseCases/Auth'

// User UseCases
export * from './UseCases/User'

// Interfaces de Servicios
export * from './Services/Auth/IAuthService'
export * from './Services/User/IUserService'
