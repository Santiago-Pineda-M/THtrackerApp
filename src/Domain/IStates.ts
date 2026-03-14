/**
 * DOMAIN LAYER - State Interfaces (IStates)
 * Define los tipos de estado para los PLOCs de autenticación.
 * 
 * @note Las definiciones de estado de autenticación principal están en 
 * Controllers/Auth/IAuthState.ts para mantener separación de capas.
 * @deprecated Estas interfaces ya no se usan activamente en la nueva arquitectura.
 */

// Las interfaces ILoginState, IRegisterState, etc. estánmarked as deprecated
// porque el nuevo patrón usa AuthSession entity en su lugar.

/**
 * Estado del formulario de login.
 * @deprecated Este estado ya no se usa activamente en la nueva arquitectura.
 */
export interface ILoginState {
    email: string;
    password: string;
    errors: Record<string, string[]>;
    isValid: boolean;
    isLoading: boolean;
    success: boolean;
    message: string;
}

/**
 * Estado del formulario de registro.
 * @deprecated Este estado ya no se usa activamente en la nueva arquitectura.
 */
export interface IRegisterState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    errors: Record<string, string[]>;
    isValid: boolean;
    isLoading: boolean;
    success: boolean;
    message: string;
}

/**
 * Estado de verificación de sesión.
 * @deprecated Este estado ya no se usa activamente en la nueva arquitectura.
 */
export interface ICheckSessionState {
    isLoading: boolean;
    isAuthenticated: boolean;
    session: unknown;
    error: string | null;
}

/**
 * Estado de refresh de token.
 * @deprecated Este estado ya no se usa activamente en la nueva arquitectura.
 */
export interface IRefreshTokenState {
    isRefreshing: boolean;
    error: string | null;
}

/**
 * Valores iniciales para los estados.
 * @deprecated Estos estados ya no se usan activamente.
 */
export const initialLoginState: ILoginState = {
    email: '',
    password: '',
    errors: {},
    isValid: false,
    isLoading: false,
    success: false,
    message: '',
};

export const initialRegisterState: IRegisterState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: {},
    isValid: false,
    isLoading: false,
    success: false,
    message: '',
};

export const initialCheckSessionState: ICheckSessionState = {
    isLoading: false,
    isAuthenticated: false,
    session: null,
    error: null,
};

export const initialRefreshTokenState: IRefreshTokenState = {
    isRefreshing: false,
    error: null,
};
