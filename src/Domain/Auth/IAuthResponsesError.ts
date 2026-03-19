/**
 * DOMAIN LAYER - Response Error Interfaces
 * Contratos para las respuestas de error de autenticación.
 * Sigue el estándar RFC 7807 para Problem Details.
 */

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
 * Estándar RFC 7807 para errores de la API.
 * Tipo genérico para parsear respuestas de error HTTP.
 */
export interface IProblemDetails {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string[]>;
}
