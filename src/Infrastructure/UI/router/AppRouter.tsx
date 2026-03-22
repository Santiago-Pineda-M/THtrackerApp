import { useEffect } from "react";
import { BrowserRouter, useRoutes, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { usePlocState } from '../../Hooks/usePlocState';
import { useDependencies } from "../../Context/DependenciesProvider";
import { AuthStatus } from '../../../Domain';
import type { IAuthState } from '../../../Domain';
import { Spinner } from '../components/atoms';
import {
    LoginPage,
    RegisterPage,
    DashboardPage,
    ExamplePage,
    UserProfilePage
} from "../pages";
import { Guard } from "./Gard";


export const AppRouter = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};


const LoadingFallback = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    }}>
        <Spinner />
        <span style={{ marginLeft: '8px' }}>Cargando sesión...</span>
    </div>
);


const AppRoutes = () => {
    const { providerAuthPloc } = useDependencies();
    const authState = usePlocState<IAuthState>(providerAuthPloc);

    useEffect(() => {
        // Si el estado es IDLE, iniciar la verificación de autenticación
        if (authState.status === AuthStatus.IDLE) {
            providerAuthPloc.init();
        }
    }, [authState.status, providerAuthPloc]);

    const isAuthenticated = authState.status === AuthStatus.AUTHENTICATED;
    const isTransitioning =
        authState.status === AuthStatus.IDLE ||
        authState.status === AuthStatus.LOADING ||
        authState.status === AuthStatus.AUTHENTICATING ||
        authState.status === AuthStatus.REFRESHING_TOKEN;

    // Definir las rutas - incluir loading como ruta comodín
    const routes: RouteObject[] = isTransitioning
        ? [
            // Cuando está cargando, mostrar spinner para cualquier ruta
            {
                path: "/*",
                element: <LoadingFallback />
            }
        ]
        : [
            // Rutas públicas
            {
                path: "/example",
                element: <ExamplePage />
            },
            // Rutas de invitados
            {
                path: "/login",
                element: (
                    <Guard isAccess={!isAuthenticated} fallback={<Navigate to="/dashboard" />}>
                        <LoginPage />
                    </Guard>
                )
            },
            {
                path: "/register",
                element: (
                    <Guard isAccess={!isAuthenticated} fallback={<Navigate to="/dashboard" />}>
                        <RegisterPage />
                    </Guard>
                )
            },
            // Rutas protegidas
            {
                path: "/dashboard",
                element: (
                    <Guard isAccess={isAuthenticated} fallback={<Navigate to="/login" />}>
                        <DashboardPage />
                    </Guard>
                )
            },
            {
                path: "/user-profile",
                element: (
                    <Guard isAccess={isAuthenticated} fallback={<Navigate to="/login" />}>
                        <UserProfilePage />
                    </Guard>
                )
            },
            // Redirecciones
            {
                path: "/",
                element: <Navigate to="/dashboard" replace />
            },
            {
                path: "*",
                element: <Navigate to="/dashboard" replace />
            }
        ];

    // useRoutes siempre se llama - sin retorno early
    return useRoutes(routes);
};

