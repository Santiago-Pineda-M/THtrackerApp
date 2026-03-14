/**
 * DOMAIN LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Dominio.
 */

// Entities
export { AuthSession, type AuthSessionProps, type UserData } from './Entities/AuthSession';
export { type IUserSession, type IAuthToken, type IAuthSession } from './Auth/AuthEntities';

// Value Objects
export { Email, AuthTokens, UserId } from './ValueObjects';

// Repositories
export type { IAuthSessionRepository } from './Repositories/IAuthSessionRepository';

// Request Interfaces
export type {
    ILoginRequest,
    IRegisterRequest,
    IRefreshTokenRequest,
    IConfirmEmailRequest,
    IResendEmailConfirmationRequest,
    IForgotPasswordRequest,
    IResetPasswordRequest,
    ILogoutRequest,
} from './Request/IAuthRequest';

// Response Interfaces
export type {
    ILoginResponse,
    IRegisterResponse,
    IRefreshTokenResponse,
    ICheckSessionResponse,
    IConfirmEmailResponse,
    IResendEmailConfirmationResponse,
    IForgotPasswordResponse,
    IResetPasswordResponse,
    ILogoutResponse,
} from './Responses/IAuthResponses';

export type {
    ILoginResponseError,
    IRefreshTokenResponseError,
    IAuthResponseError,
    INetworkError,
    IValidationError,
} from './Responses/IAuthResponsesError';

// Pattern Interfaces
export { 
    type IUseCase, 
    type IHttpClient, 
    type ISecureStorage, 
    type IStorage,
    type UseCaseResult,
    successResult,
    errorResult,
} from './IPatterns';

// State Interfaces
export {
    type ILoginState,
    type IRegisterState,
    type ICheckSessionState,
    type IRefreshTokenState,
    initialLoginState,
    initialRegisterState,
    initialCheckSessionState,
    initialRefreshTokenState,
} from './IStates';

// Auth Status (from Auth module)
export { AuthStatus } from './Auth/AuthStatus';

// Domain Services
export { AuthValidationService, type ValidationError, type ValidationResult, type LoginRequestData, type RegisterRequestData } from './Services';

// Base PLOC
export { Ploc } from './Ploc';
