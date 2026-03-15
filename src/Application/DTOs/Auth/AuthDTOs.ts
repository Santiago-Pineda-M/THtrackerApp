/**
 * APPLICATION LAYER - Auth DTOs
 * Data Transfer Objects específicos de la API externa.
 * Solo contiene tipos que NO están ya definidos en el Domain.
 */

/**
 * Respuesta de la API al refrescar un token.
 * Contiene `refreshTokenExpiry` que es específico de esta API (ISO date string).
 */
export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiry: string; // ISO Date String — campo propio de la API
}

/**
 * Estándar RFC 7807 para errores de la API.
 * Centralizado aquí para evitar duplicados entre Infrastructure y Application.
 */
export interface ProblemDetails {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string[]>;
}
