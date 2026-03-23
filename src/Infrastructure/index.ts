/**
 * INFRASTRUCTURE LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Infraestructura.
 */

// HTTP Clients
export { FetchHttpClient } from './Adapters/http/FetchHttpClient';

// Storage Adapters
export { LocalStorageAdapter, SecureStorageAdapter } from './Adapters/storage';

// Repositories
export { AuthSessionRepository } from './Repositories/AuthSessionRepository';

// Dependency Injection
export { dependenciesLocator } from './DI/DependenciesLocator';

// Context
export { DependenciesProvider, useDependencies } from './Context/DependenciesProvider';

// Services
export { CategoryService } from './Services/CategoryService';

// Hooks
export { usePlocState } from './Hooks/usePlocState';

// UI
export { AppRouter } from './UI/router/AppRouter';
