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
export { AuthService } from '../Application/Services/Auth/AuthService'
export { ActivityService } from '../Application/Services/Activity/ActivityService'
export { ActivityLogService } from '../Application/Services/ActivityLog/ActivityLogService'
export { CategoryService } from '../Application/Services/Category/CategoryService'
export { UserService } from '../Application/Services/User/UserService'
export { UserSessionService } from '../Application/Services/UserSession/UserSessionService'

// Hooks
export { usePlocState } from './Hooks/usePlocState'

// UI
export { AppRouter } from './UI/router/AppRouter'
