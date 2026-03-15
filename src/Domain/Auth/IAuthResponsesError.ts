/**
 * DOMAIN LAYER - Response Error Interfaces
 * Contratos para las respuestas de error de autenticación.
 * Sigue el estándar RFC 7807 para Problem Details.
 */

/**
 * Errores de validación del formulario.
 */
export interface IValidationError {
    field: string;
    messages: string[];
}

/**
 * Respuesta de error de login.
 */
export interface ILoginResponseError {
    title: string;
    status: number;
    detail?: string;
    errors?: Record<string, string[]>;
    type?: string;
}

/**
 * Respuesta de error de refresh de token.
 */
export interface IRefreshTokenResponseError {
    title: string;
    status: number;
    detail?: string;
    type?: string;
}

/**
 * Respuesta de error genérica de autenticación.
 */
export interface IAuthResponseError {
    title: string;
    status: number;
    detail?: string;
    errors?: Record<string, string[]>;
    type?: string;
}

/**
 * Error de red o conexión.
 */
export interface INetworkError {
    code: string;
    message: string;
    status?: number;
}
