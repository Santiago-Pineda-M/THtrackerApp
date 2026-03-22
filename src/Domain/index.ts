/**
 * DOMAIN LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Dominio.
 * Solo exports relacionados con autenticación.
 */

// Entities
export { AuthSession, type AuthSessionProps, type UserData } from './Entities/AuthSession';
export { SidebarState, type SidebarStateProps } from './Entities/SidebarState';

// Value Objects
export { Email, AuthTokens, decodeJwtExp, isoToExpiresInSeconds } from './ValueObjects';
export { UserId } from './ValueObjects/UserId';

// Repositories
export type { IAuthSessionRepository } from './Repositories/IAuthSessionRepository';
export type { ISidebarRepository } from './Repositories/ISidebarRepository';

// Request Interfaces (Auth)
export type {
    ILoginRequest,
    IRegisterRequest,
    IRefreshTokenRequest,
} from './Auth/IAuthRequest';

// Response Interfaces (Auth)
export type {
    ILoginResponse,
    IRegisterResponse,
    IRefreshTokenResponse,
} from './Auth/IAuthResponses';

// Error Response Interfaces
export type {
    ILoginResponseError,
    IRefreshTokenResponseError,
    IProblemDetails,
} from './Auth/IAuthResponsesError';

// Pattern Interfaces
export { 
    type IUseCase, 
    type IHttpClient, 
    type ISecureStorage, 
    type IStorage,
    type HttpResponse,
} from './IPatterns';

// States & Enums
export * from './IStates';

// Domain Services
export { AuthValidationService, type ValidationError, type ValidationResult, type LoginRequestData, type RegisterRequestData } from './Services';

// Base PLOC
export { Ploc } from './Ploc';

// User Domain Types
export type {
    UserProfileResponse,
    ProblemDetails,
} from './User/IUserResponses';
export type {
    UpdateUserProfileRequest,
} from './User/IUserRequests';
