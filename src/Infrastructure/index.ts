/**
 * INFRASTRUCTURE LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Infraestructura.
 */
export { FetchHttpClient } from './Adapters/http/FetchHttpClient';
export { LocalStorageAdapter, SecureStorageAdapter } from './Adapters/storage';
export { dependenciesLocator } from './DI/DependenciesLocator';
export { usePlocState } from './Hooks/usePlocState';
export { AppRouter } from './UI/router/AppRouter';
