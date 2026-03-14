/**
 * DOMAIN LAYER - Request Interfaces
 * Contratos para las solicitudes de autenticación.
 */

/**
 * Request para iniciar sesión.
 */
export interface ILoginRequest {
    email: string;
    password: string;
    deviceInfo: string;
}

/**
 * Request para registrar un nuevo usuario.
 */
export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

/**
 * Request para refrescar el token de acceso.
 */
export interface IRefreshTokenRequest {
    refreshToken: string;
}

/**
 * Request para confirmar correo electrónico.
 */
export interface IConfirmEmailRequest {
    userId: string;
    code: string;
}

/**
 * Request para reenviar correo de confirmación.
 */
export interface IResendEmailConfirmationRequest {
    email: string;
}

/**
 * Request para solicitar recuperación de contraseña.
 */
export interface IForgotPasswordRequest {
    email: string;
}

/**
 * Request para resetear la contraseña.
 */
export interface IResetPasswordRequest {
    userId: string;
    resetToken: string;
    newPassword: string;
    confirmPassword?: string;
}

/**
 * Request para cerrar sesión.
 */
export interface ILogoutRequest {
    refreshToken?: string;
}
