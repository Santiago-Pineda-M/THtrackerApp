/**
 * DOMAIN LAYER - Repository Interfaces
 * Define el contrato para el almacenamiento de sesiones de autenticación.
 * Abstrae el mecanismo de persistencia (SecureStorage, AsyncStorage, etc.)
 */

import { AuthSession } from '../Entities/AuthSession';

export interface IAuthSessionRepository {
    /**
     * Obtiene la sesión de autenticación persistida.
     * @returns La sesión activa o null si no existe.
     */
    getSession(): Promise<AuthSession | null>;
    
    /**
     * Persiste la sesión de autenticación.
     * @param session La sesión a guardar.
     */
    saveSession(session: AuthSession): Promise<void>;
    
    /**
     * Elimina la sesión de autenticación (logout).
     */
    clearSession(): Promise<void>;
    
    /**
     * Actualiza solo los tokens de la sesión existente.
     * @param session La sesión con los nuevos tokens.
     */
    updateSession(session: AuthSession): Promise<void>;
}
