/**
 * INFRASTRUCTURE LAYER - Debug Hook
 * Hook personalizado para obtener información de debug.
 * 
 * IMPORTANTE: Este hook sigue la arquitectura DDD correcta:
 * - Usa el DebugPloc (Controllers) que gestiona la actualización
 * - No accede directamente al repository (eso violaría las capas)
 * - Es reactivo gracias al patrón Observer del Ploc
 */
import { useEffect } from 'react';
import { usePlocState } from './usePlocState';
import { dependenciesLocator } from '../DI/DependenciesLocator';
import type { IDebugState, IAuthState } from '../../Domain';

/**
 * Hook para obtener información de debug de la aplicación.
 * 
 * Flujo de datos (siguiendo DDD):
 * 1. UI llama al hook
 * 2. Hook usa usePlocState para suscribirse al DebugPloc
 * 3. DebugPloc ejecuta GetDebugInfoUseCase
 * 4. GetDebugInfoUseCase obtiene datos de:
 *    - AuthSessionRepository (Domain)
 *    - AuthStateProvider (Controllers)
 *    - ApiCallTracker (DebugPloc)
 * 5. El estado fluye de vuelta a la UI reactivamente
 * 
 * @returns Estado de debug completo y estado de autenticación
 */
export function useDebugInfo(): { 
    debugState: IDebugState; 
    authState: IAuthState;
    forceRefreshToken: () => Promise<void>; 
} {
    // Obtener los Plocs del locator de dependencias
    const debugPloc = dependenciesLocator.provideDebugPloc();
    const authPloc = dependenciesLocator.provideAuthPloc();
    
    // Usar usePlocState para obtener estado reactivo
    const debugState = usePlocState<IDebugState>(debugPloc);
    const authState = usePlocState<IAuthState>(authPloc);
    
    // Iniciar actualización al montar, detener al desmontar
    useEffect(() => {
        // Iniciar el ciclo de actualización
        debugPloc.startUpdating();
        
        // Limpieza al desmontar
        return () => {
            debugPloc.stopUpdating();
        };
    }, [debugPloc]);

    // Coordinar Plocs: Si cambia el estado de auth, recargar info de debug para mostrar nuevos tokens
    useEffect(() => {
        debugPloc.refresh();
    }, [authState.status, debugPloc]);
    
    return { 
        debugState, 
        authState,
        forceRefreshToken: () => authPloc.forceRefreshToken()
    };
}
