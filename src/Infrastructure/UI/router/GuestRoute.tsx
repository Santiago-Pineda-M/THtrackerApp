/**
 * INFRASTRUCTURE LAYER - Guest Route Component
 * Componente de ruta para páginas de invitados (login, register).
 * Si el usuario ya está autenticado, redirige al dashboard.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { usePlocState } from '../../Hooks/usePlocState';
import { dependenciesLocator } from '../../DI/DependenciesLocator';
import { AuthStatus } from '../../../Domain';
import type { IAuthState } from '../../../Domain';
import { useEffect, useRef } from 'react';
import { AuthPloc } from '../../../Controllers/Auth/AuthPloc';

interface GuestRouteProps {
  /**
   * Ruta a la que redirigir cuando YA está autenticado.
   * Por defecto: /dashboard
   */
  redirectTo?: string;
  
  /**
   *children alternativos para mostrar durante la carga.
   */
  loadingFallback?: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ 
  redirectTo = '/dashboard',
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
        <span>Cargando...</span>
      </div>
    );
  }

  // Ya está autenticado - redirigir al dashboard
  if (state.status === AuthStatus.AUTHENTICATED) {
    return <Navigate to={redirectTo} replace />;
  }

  // No autenticado - mostrar contenido (login/register)
  return <Outlet />;
};

export default GuestRoute;
