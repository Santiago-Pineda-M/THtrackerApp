import { Navigate, Outlet } from 'react-router-dom';
import { usePlocState } from '../../Hooks/usePlocState';
import { dependenciesLocator } from '../../DI/DependenciesLocator';
import { AuthStatus } from '../../../Domain';
import { useEffect } from 'react';
import { Spinner } from '../components/atoms';

export const ProtectedRoute = () => {
  const authPloc = dependenciesLocator.provideAuthPloc();
  const state = usePlocState(authPloc);

  useEffect(() => {
    if (state.status === AuthStatus.IDLE) {
      authPloc.init();
    }
  }, [state.status, authPloc]);

  if (
    state.status === AuthStatus.IDLE ||
    state.status === AuthStatus.AUTHENTICATING ||
    state.status === AuthStatus.REFRESHING_TOKEN
  ) {
    return (
      <>
        <Spinner />
        <span>Cargando sesión...</span>
      </>
    );
  }

  if (
    state.status === AuthStatus.UNAUTHENTICATED ||
    state.status === AuthStatus.FAILED
  ) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};