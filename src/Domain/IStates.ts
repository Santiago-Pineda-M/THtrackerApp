/**
 * DOMAIN LAYER - State Interfaces
 * Contiene los estados globales para los PLOCs en la aplicación.
 * Centralizado siguiendo principios de Clean Architecture para evitar acoplamiento ciclico.
 */

import type { IUserSession, IAuthToken } from './Auth/AuthEntities';

/**
 * ==========================================
 * AUTHENTICATION STATES
 * ==========================================
 */

/**
 * Definición de los estados para la máquina de estados de autenticación.
 */
export const AuthStatus = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    AUTHENTICATING: 'AUTHENTICATING',
    AUTHENTICATED: 'AUTHENTICATED',
    FAILED: 'FAILED',
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    LOGGING_OUT: 'LOGGING_OUT',
    REFRESHING_TOKEN: 'REFRESHING_TOKEN',
} as const;

export type AuthStatus = typeof AuthStatus[keyof typeof AuthStatus];

/**
 * Interfaz del estado de autenticación usado por AuthPloc.
 */
export interface IAuthState {
    status: AuthStatus;
    user?: IUserSession;
    token?: IAuthToken;
    error?: string;
}

export const initialAuthState: IAuthState = {
    status: AuthStatus.IDLE
};

/**
 * ==========================================
 * DEBUG STATES
 * ==========================================
 */

export interface DebugTokenExpiryInfo {
    accessTokenExpiry: Date | null;
    refreshTokenExpiry: Date | null;
    isExpired: boolean;
    needsRefresh: boolean;
}

export interface DebugApiCallInfo {
    timestamp: Date | null;
    endpoint: string | null;
    status: number | null;
    method: string | null;
}

export interface DebugStorageInfo {
    size: number;
    keys: string[];
    contents: Record<string, string>;
}

export interface DebugAppInfo {
    appVersion: string;
    environment: string;
    buildTimestamp: string;
}

export interface DebugNavigatorInfo {
    online: boolean;
    connectionType: string;
    userAgent: string;
}

export interface IDebugState {
    tokenExpiry: DebugTokenExpiryInfo;
    lastApiCall: DebugApiCallInfo;
    storageInfo: DebugStorageInfo;
    appInfo: DebugAppInfo;
    navigatorInfo: DebugNavigatorInfo;
    renderCount: number;
    lastUpdate: Date;
}

export const initialDebugState: IDebugState = {
    tokenExpiry: {
        accessTokenExpiry: null,
        refreshTokenExpiry: null,
        isExpired: true,
        needsRefresh: true
    },
    lastApiCall: {
        timestamp: null,
        endpoint: null,
        status: null,
        method: null
    },
    storageInfo: {
        size: 0,
        keys: [],
        contents: {}
    },
    appInfo: {
        appVersion: '1.0.0',
        environment: 'development',
        buildTimestamp: new Date().toISOString()
    },
    navigatorInfo: {
        online: true,
        connectionType: 'unknown',
        userAgent: ''
    },
    renderCount: 0,
    lastUpdate: new Date()
};
