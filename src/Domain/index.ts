/**
 * DOMAIN LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Dominio.
 */

// Entities
export { AuthSession, type AuthSessionProps, type UserData } from './Entities/AuthSession';
export { type IUserSession } from './Auth/AuthEntities';
export { User, type IUser } from './User/UserEntities';
export type { IUpdateUserRequest } from './User/IUserSelfRequest';
export type { IUserDto } from './User/IUserSelfResponse';

// Value Objects
export { Email, AuthTokens, UserId } from './ValueObjects';

// Repositories
export type { IAuthSessionRepository } from './Repositories/IAuthSessionRepository';

// Request Interfaces (3 endpoints que realmente existen en la API)
export type {
    ILoginRequest,
    IRegisterRequest,
    IRefreshTokenRequest,
} from './Auth/IAuthRequest';

// Response Interfaces (3 endpoints que realmente existen en la API)
export type {
    ILoginResponse,
    IRegisterResponse,
    IRefreshTokenResponse,
} from './Auth/IAuthResponses';

// Error Response Interfaces
export type {
    ILoginResponseError,
    IRefreshTokenResponseError,
    IAuthResponseError,
    INetworkError,
    IValidationError,
} from './Auth/IAuthResponsesError';

// Pattern Interfaces
export { 
    type IUseCase, 
    type IHttpClient, 
    type ISecureStorage, 
    type IStorage,
    type HttpResponse,
    type UseCaseResult,
    successResult,
    errorResult,
} from './IPatterns';

// States & Enums
export * from './IStates';

// Domain Services
export { AuthValidationService, type ValidationError, type ValidationResult, type LoginRequestData, type RegisterRequestData } from './Services';

// Base PLOC
export { Ploc } from './Ploc';
