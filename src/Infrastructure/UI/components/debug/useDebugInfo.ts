/**
 * INFRASTRUCTURE LAYER - Debug Hook
 * Hook personalizado para recopilar información de debug de la aplicación.
 * Utiliza la arquitectura del proyecto (Plocs, Repositories).
 */

import { useState, useEffect, useCallback } from 'react';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import type { IAuthState } from '../../../../Controllers/Auth/IAuthState';
import type { AuthSession } from '../../../../Domain/Entities/AuthSession';

export interface DebugInfo {
    // Authentication
    authState: IAuthState | null;
    session: AuthSession | null;
    accessTokenExpiry: Date | null;
    refreshTokenExpiry: Date | null;
    isTokenExpired: boolean;
    needsTokenRefresh: boolean;
    userInfo: {
        id: string;
        name: string;
        email: string;
    } | null;
    
    // API Info
    lastApiResponse: {
        timestamp: Date | null;
        endpoint: string | null;
        status: number | null;
        method: string | null;
    };
    
    // Storage
    localStorage: {
        size: number;
        keys: string[];
        contents: Record<string, string>;
    };
    
    // App Info
    appVersion: string;
    environment: string;
    buildTimestamp: string;
    
    // Connection
    navigatorInfo: {
        online: boolean;
        connectionType: string;
        userAgent: string;
    };
}

interface LastApiCall {
    timestamp: Date;
    endpoint: string;
    status: number;
    method: string;
}

/**
 * Hook para obtener información de debug de la aplicación.
 * Solo funciona en entorno de desarrollo.
 */
export function useDebugInfo(): DebugInfo {
    const authPloc = dependenciesLocator.provideAuthPloc();
    const authState = usePlocState<IAuthState>(authPloc);
    const [lastApiCall, setLastApiCall] = useState<LastApiCall | null>(null);
    const [authSession, setAuthSession] = useState<AuthSession | null>(null);

    // Cargar la sesión de autenticación desde el repository
    useEffect(() => {
        const loadSession = async () => {
            try {
                const repository = dependenciesLocator.provideAuthSessionRepository();
                const session = await repository.getSession();
                setAuthSession(session);
            } catch {
                setAuthSession(null);
            }
        };
        
        loadSession();
    }, []);

    // Interceptar llamadas API para registrar última respuesta
    useEffect(() => {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const url = args[0] as string;
            const method = args[1]?.method || 'GET';
            
            try {
                const response = await originalFetch(...args);
                setLastApiCall({
                    timestamp: new Date(),
                    endpoint: url,
                    status: response.status,
                    method: method
                });
                return response;
            } catch (error) {
                setLastApiCall({
                    timestamp: new Date(),
                    endpoint: url,
                    status: 0,
                    method: method
                });
                throw error;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    const getLocalStorageInfo = useCallback(() => {
        try {
            const keys: string[] = [];
            const contents: Record<string, string> = {};
            let size = 0;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    keys.push(key);
                    const value = localStorage.getItem(key) || '';
                    contents[key] = value;
                    size += key.length + value.length;
                }
            }

            return {
                size: Math.round(size / 1024 * 100) / 100, // KB
                keys,
                contents
            };
        } catch {
            return {
                size: 0,
                keys: [],
                contents: {}
            };
        }
    }, []);

    const getConnectionInfo = useCallback(() => {
        return {
            online: navigator.onLine,
            connectionType: 'unknown',
            userAgent: navigator.userAgent
        };
    }, []);

    // Obtener información de expiry del token desde la sesión
    const getTokenExpiryInfo = useCallback((): { 
        access: Date | null; 
        refresh: Date | null;
        isExpired: boolean;
        needsRefresh: boolean;
    } => {
        if (!authSession) {
            return { 
                access: null, 
                refresh: null,
                isExpired: true,
                needsRefresh: true
            };
        }
        
        const expiresAt = authSession.expiresAt;
        const accessExpiry = expiresAt > 0 ? new Date(expiresAt * 1000) : null;
        
        // La sesión tiene métodos para verificar expiración
        return {
            access: accessExpiry,
            refresh: null, // El refresh token no tiene expiry visible
            isExpired: authSession.isExpired(),
            needsRefresh: authSession.needsRefresh()
        };
    }, [authSession]);

    const tokenExpiryInfo = getTokenExpiryInfo();

    const debugInfo: DebugInfo = {
        authState: authState,
        session: authSession,
        accessTokenExpiry: tokenExpiryInfo.access,
        refreshTokenExpiry: tokenExpiryInfo.refresh,
        isTokenExpired: tokenExpiryInfo.isExpired,
        needsTokenRefresh: tokenExpiryInfo.needsRefresh,
        userInfo: authSession ? {
            id: authSession.userId,
            name: authSession.name || '',
            email: authSession.email
        } : authState?.user ? {
            id: authState.user.id,
            name: authState.user.name || '',
            email: authState.user.email
        } : null,
        lastApiResponse: lastApiCall ? {
            timestamp: lastApiCall.timestamp,
            endpoint: lastApiCall.endpoint,
            status: lastApiCall.status,
            method: lastApiCall.method
        } : {
            timestamp: null,
            endpoint: null,
            status: null,
            method: null
        },
        localStorage: getLocalStorageInfo(),
        appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.MODE || 'development',
        buildTimestamp: import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString(),
        navigatorInfo: getConnectionInfo()
    };

    return debugInfo;
}
