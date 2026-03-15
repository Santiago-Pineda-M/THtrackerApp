import { Navigate, Outlet } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { AuthStatus } from '../../../../Domain';
import { useEffect } from 'react';
import { Spinner } from '../shared';

export const ProtectedRoute = () => {
    const authPloc = dependenciesLocator.provideAuthPloc();
    const state = usePlocState(authPloc);

    useEffect(() => {
        if (state.status === AuthStatus.IDLE) {
            authPloc.init();
        }
    }, [state.status, authPloc]);

    if (state.status === AuthStatus.IDLE ||
        state.status === AuthStatus.AUTHENTICATING ||
        state.status === AuthStatus.REFRESHING_TOKEN) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-main">
                <Spinner size="lg" />
                <span className="mt-4 text-muted font-medium">Cargando sesión...</span>
            </div>
        );
    }

    if (state.status === AuthStatus.UNAUTHENTICATED || state.status === AuthStatus.FAILED) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
