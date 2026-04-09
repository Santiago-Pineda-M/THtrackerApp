/**
 * INFRASTRUCTURE LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Infraestructura.
 */

// HTTP Clients
export { FetchHttpClient } from './Adapters/http/FetchHttpClient'

// Storage Adapters
export { LocalStorageAdapter, SecureStorageAdapter } from './Adapters/storage'

// Repositories
export { AuthSessionRepository } from './Repositories/AuthSessionRepository'
export { SidebarRepository } from './Repositories/SidebarRepository'

// Dependency Injection
export { dependenciesLocator } from './DI/DependenciesLocator'

// Context
export { DependenciesProvider } from './Context/DependenciesProvider'
export { useDependencies } from './Context/useDependencies'

// Services
export { AuthService } from './Services/AuthService'
export { ActivityService } from './Services/ActivityService'
export { ActivityLogService } from './Services/ActivityLogService'
export { CategoryService } from './Services/CategoryService'
export { UserService } from './Services/UserService'
export { UserSessionService } from './Services/UserSessionService'

// Hooks
export { usePlocState } from './Hooks/usePlocState'

// UI
export { AppRouter } from './UI/router/AppRouter'
