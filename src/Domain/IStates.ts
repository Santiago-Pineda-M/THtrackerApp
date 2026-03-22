/**
 * DOMAIN LAYER - State Interfaces
 * Contiene los estados globales para los PLOCs de autenticación.
 * Centralizado siguiendo principios de Clean Architecture para evitar acoplamiento ciclico.
 */

import type { AuthSession } from './Entities/AuthSession';

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
    user?: AuthSession | null;
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

/**
 * ==========================================
 * SIDEBAR STATES
 * ==========================================
 */

/**
 * Interfaz del estado del componente Sidebar.
 * Usada por SidebarPloc para gestionar el estado del menú.
 */
export interface ISidebarState {
    isMenuOpen: boolean;
}

export const initialSidebarState: ISidebarState = {
    isMenuOpen: true,
};

/**
 * ==========================================
 * USER PROFILE DISPLAY STATE
 * ==========================================
 */

/**
 * Estado simple para mostrar el perfil del usuario (consulta)
 */
export interface IUserProfileDisplayState {
    user: {
        id: string;
        name: string | null;
        email: string | null;
    } | null;
    error: {
        title?: string;
        detail?: string;
    } | null;
    isLoading: boolean;
}

export const initialUserProfileDisplayState: IUserProfileDisplayState = {
    user: null,
    error: null,
    isLoading: false,
};

/**
 * ==========================================
 * USER PROFILE FORM STATE
 * ==========================================
 */

/**
 * Estado simple para el formulario de actualización de perfil
 */
export interface IUserProfileFormState {
    name: string;
    email: string;
    errors: Record<string, string[]>;
    isLoading: boolean;
    success: boolean;
    message: string;
    initialValues: {
        name: string;
        email: string;
    };
}

export const initialUserProfileFormState: IUserProfileFormState = {
    name: '',
    email: '',
    errors: {},
    isLoading: false,
    success: false,
    message: '',
    initialValues: {
        name: '',
        email: '',
    },
};
