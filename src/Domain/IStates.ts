/**
 * DOMAIN LAYER - State Interfaces
 * Contiene los estados globales para los PLOCs de autenticación.
 * Centralizado siguiendo principios de Clean Architecture para evitar acoplamiento ciclico.
 */

import type { IUserSession } from './Auth/AuthEntities';

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
    status: AuthStatus,
    user?: IUserSession
}

export const initialAuthState: IAuthState = {
    status: AuthStatus.IDLE,
    user: undefined,
};

/**
 * ==========================================
 * LOGIN STATES
 * ==========================================
 */

/**
 * Interfaz del estado del formulario de login.
 * Usada por LoginPloc para gestionar el flujo de login.
 */
export interface ILoginState {
    email: string;
    password: string;
    errors: Record<string, string[]>;
    success: boolean;
    message: string;
    isLoading: boolean;
}

export const initialLoginState: ILoginState = {
    email: '',
    password: '',
    errors: {},
    success: false,
    message: '',
    isLoading: false,
};

/**
 * ==========================================
 * REGISTER STATES
 * ==========================================
 */

/**
 * Interfaz del estado del formulario de registro.
 * Usada por RegisterPloc para gestionar el flujo de registro.
 */
export interface IRegisterState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    errors: Record<string, string[]>;
    success: boolean;
    message: string;
    isLoading: boolean;
}

export const initialRegisterState: IRegisterState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: {},
    success: false,
    message: '',
    isLoading: false,
};

/**
 * ==========================================
 * REFRESH TOKEN STATES
 * ==========================================
 */

export interface IRefreshTokenState {
    isRefreshing: boolean;
    success: boolean;
    error?: string;
}

export const initialRefreshTokenState: IRefreshTokenState = {
    isRefreshing: false,
    success: false,
    error: undefined,
};

/**
 * ==========================================
 * LOGOUT STATES
 * ==========================================
 */

export interface ILogoutState {
    isLoggingOut: boolean;
    success: boolean;
    error?: string;
}

export const initialLogoutState: ILogoutState = {
    isLoggingOut: false,
    success: false,
    error: undefined,
};
