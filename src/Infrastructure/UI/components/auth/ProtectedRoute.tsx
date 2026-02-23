/**
 * UI LAYER - Auth Components
 * ProtectedRoute: Componente de orden superior que protege rutas privadas.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { AuthStatus } from '../../../../Domain';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
    const authPloc = dependenciesLocator.provideAuthPloc();
    const state = usePlocState(authPloc);

    useEffect(() => {
        // Si el estado es IDLE, iniciamos la validación de sesión (re-auth)
        if (state.status === AuthStatus.IDLE) {
            authPloc.init();
        }
    }, [state.status, authPloc]);

    // Estados de carga / transición
    if (state.status === AuthStatus.IDLE ||
        state.status === AuthStatus.AUTHENTICATING ||
        state.status === AuthStatus.REFRESHING_TOKEN) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300 font-medium">Cargando sesión...</span>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (state.status === AuthStatus.UNAUTHENTICATED || state.status === AuthStatus.FAILED) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, renderizar la ruta privada
    return <Outlet />;
};
