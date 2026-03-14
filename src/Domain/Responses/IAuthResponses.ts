/**
 * DOMAIN LAYER - Response Interfaces
 * Contratos para las respuestas de autenticación exitosas.
 */

import type { UserData } from '../Entities/AuthSession';

/**
 * Respuesta exitosa de login.
 */
export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // Segundos
    tokenType: string;
    user?: UserData;
}

/**
 * Respuesta exitosa de registro.
 */
export interface IRegisterResponse {
    message: string;
    userId?: string;
    requiresEmailConfirmation?: boolean;
}

/**
 * Respuesta exitosa de refresh de token.
 */
export interface IRefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}

/**
 * Respuesta exitosa de verificación de sesión.
 */
export interface ICheckSessionResponse {
    isAuthenticated: boolean;
    user?: UserData;
    expiresAt?: number;
}

/**
 * Respuesta exitosa de confirmación de email.
 */
export interface IConfirmEmailResponse {
    success: boolean;
    message: string;
}

/**
 * Respuesta exitosa de reenvío de email de confirmación.
 */
export interface IResendEmailConfirmationResponse {
    success: boolean;
    message: string;
}

/**
 * Respuesta exitosa de recuperación de contraseña.
 */
export interface IForgotPasswordResponse {
    success: boolean;
    message: string;
}

/**
 * Respuesta exitosa de reset de contraseña.
 */
export interface IResetPasswordResponse {
    success: boolean;
    message: string;
}

/**
 * Respuesta exitosa de cierre de sesión.
 */
export interface ILogoutResponse {
    success: boolean;
    message: string;
}
