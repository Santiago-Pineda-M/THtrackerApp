/**
 * APPLICATION LAYER - Auth Module
 * Data Transfer Objects (DTOs) basados en los contratos de Swagger.
 */

export interface LoginRequest {
    email: string;
    password: string;
    deviceInfo: string;
}

export interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiry: string; // ISO Date String
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface UserDto {
    id: string;
    name: string;
    email: string;
}

/**
 * Estándar RFC 7807 para detalles de errores de la API.
 */
export interface ProblemDetails {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string[]>;
}
