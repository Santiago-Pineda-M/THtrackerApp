/**
 * INFRASTRUCTURE LAYER - Auth Route Component
 * Componente de ruta que protege rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige al login.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { usePlocState } from '../../Hooks/usePlocState';
import { dependenciesLocator } from '../../DI/DependenciesLocator';
import { AuthStatus } from '../../../Domain';
import type { IAuthState } from '../../../Domain';
import { useEffect, useRef } from 'react';
import { Spinner } from '../components/atoms';
import { AuthPloc } from '../../../Controllers/Auth/AuthPloc';

interface AuthRouteProps {
  /**
   * Ruta a la que redirigir cuando no está autenticado.
   * Por defecto: /login
   */
  redirectTo?: string;
  
  /**
   *children alternativos para mostrar durante la carga.
   * Por defecto: Spinner con mensaje.
   */
  loadingFallback?: React.ReactNode;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ 
  redirectTo = '/login',
  loadingFallback 
}) => {
  const authPloc = dependenciesLocator.providerAuthPloc as AuthPloc;
  const state = usePlocState<IAuthState>(authPloc);
  const initialized = useRef(false);

  // Initialize auth only once on mount
     
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      authPloc.init();
    }
  }, []); // Empty deps - only run once on mount

  // Estados de carga
  if (
    state.status === AuthStatus.IDLE ||
    state.status === AuthStatus.AUTHENTICATING ||
    state.status === AuthStatus.REFRESHING_TOKEN ||
    state.status === AuthStatus.LOADING
  ) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
        <span style={{ marginLeft: '8px' }}>Cargando sesión...</span>
      </div>
    );
  }

  // No autenticado - redirigir al login
  if (
    state.status === AuthStatus.UNAUTHENTICATED ||
    state.status === AuthStatus.FAILED
  ) {
    return <Navigate to={redirectTo} replace />;
  }

  // Autenticado - mostrar contenido
  return <Outlet />;
};

export default AuthRoute;
