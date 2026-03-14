/**
 * INFRASTRUCTURE LAYER - Dependencies Hooks
 * Hooks para acceder a las dependencias del contenedor.
 */

import { createContext, useContext } from 'react';
import { dependenciesLocator } from '../DI/DependenciesLocator';

/**
 * Tipo que define todas las dependencias disponibles.
 */
export type Dependencies = typeof dependenciesLocator;

/**
 * Contexto de dependencias.
 */
export const DependenciesContext = createContext<Dependencies | null>(null);

/**
 * Hook para acceder a las dependencias en cualquier componente.
 * @throws Error si se usa fuera del DependenciesProvider
 */
export const useDependencies = (): Dependencies => {
    const context = useContext(DependenciesContext);
    if (!context) {
        throw new Error('useDependencies must be used within DependenciesProvider');
    }
    return context;
};

/**
 * Proveedor de contexto que inyecta las dependencias en la aplicación.
 */
export const DependenciesProvider = DependenciesContext.Provider;

/**
 * Hooks individuales para acceder a dependencias específicas.
 */
export const useAuthPloc = () => {
    return useDependencies().provideAuthPloc();
};

export const useHealthPloc = () => {
    return useDependencies().provideHealthPloc();
};

export const useHttpClient = () => {
    return useDependencies().provideHttpClient();
};

export const useLocalStorageAdapter = () => {
    return useDependencies().provideLocalStorageAdapter();
};
