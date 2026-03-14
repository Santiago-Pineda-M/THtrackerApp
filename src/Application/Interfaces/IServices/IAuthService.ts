/**
 * APPLICATION LAYER - Auth Service Interface
 * Puerto unificado para servicios de autenticación.
 * Definido en Application, implementado en Infrastructure.
 */

import type {
    ILoginRequest,
    IRegisterRequest,
    IRefreshTokenRequest,
    IConfirmEmailRequest,
    IResendEmailConfirmationRequest,
    IForgotPasswordRequest,
    IResetPasswordRequest,
} from '../../../Domain/Request/IAuthRequest';

import type {
    ILoginResponse,
    IRegisterResponse,
    IRefreshTokenResponse,
    IConfirmEmailResponse,
    IResendEmailConfirmationResponse,
    IForgotPasswordResponse,
    IResetPasswordResponse,
} from '../../../Domain/Responses/IAuthResponses';

import type {
    ILoginResponseError,
    IRefreshTokenResponseError,
} from '../../../Domain/Responses/IAuthResponsesError';

/**
 * Interfaz unificada para servicios de autenticación.
 * Expone todos los métodos de autenticación disponibles.
 */
export interface IAuthService {
    /**
     * Inicia sesión con credenciales.
     */
    login(request: ILoginRequest): Promise<ILoginResponse | ILoginResponseError>;
    
    /**
     * Registra un nuevo usuario.
     */
    register(request: IRegisterRequest): Promise<IRegisterResponse | ILoginResponseError>;
    
    /**
     * Cierra la sesión actual.
     */
    logout(): Promise<void>;
    
    /**
     * Refresca el token de acceso.
     */
    refreshToken(request: IRefreshTokenRequest): Promise<IRefreshTokenResponse | IRefreshTokenResponseError>;
    
    /**
     * Confirma el correo electrónico.
     */
    confirmEmail(request: IConfirmEmailRequest): Promise<IConfirmEmailResponse>;
    
    /**
     * Reenvía el correo de confirmación.
     */
    resendConfirmationEmail(request: IResendEmailConfirmationRequest): Promise<IResendEmailConfirmationResponse>;
    
    /**
     * Solicita recuperación de contraseña.
     */
    forgotPassword(request: IForgotPasswordRequest): Promise<IForgotPasswordResponse>;
    
    /**
     * Resetea la contraseña.
     */
    resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse>;
}

/**
 * Interfaces segregadas para mayor flexibilidad.
 * Permiten inyectar solo los servicios necesarios.
 */
export interface ILoginService {
    login(request: ILoginRequest): Promise<ILoginResponse | ILoginResponseError>;
    logout(): Promise<void>;
}

export interface ITokenService {
    refreshToken(request: IRefreshTokenRequest): Promise<IRefreshTokenResponse | IRefreshTokenResponseError>;
}

export interface IRegistrationService {
    register(request: IRegisterRequest): Promise<IRegisterResponse | ILoginResponseError>;
    confirmEmail(request: IConfirmEmailRequest): Promise<IConfirmEmailResponse>;
    resendConfirmationEmail(request: IResendEmailConfirmationRequest): Promise<IResendEmailConfirmationResponse>;
}

export interface IPasswordService {
    forgotPassword(request: IForgotPasswordRequest): Promise<IForgotPasswordResponse>;
    resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse>;
}

/**
 * Combinación de servicios para casos de uso comunes.
 */
export interface IAuthServiceCombined extends ILoginService, ITokenService, IRegistrationService, IPasswordService {}
