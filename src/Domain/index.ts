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

// Common Types
export type { ApiErrorResponse } from './Common/IApiErrorResponse';

// User Domain Types
export type {
    UserProfileResponse,
    ProblemDetails,
} from './User/IUserResponses';
export type {
    UpdateUserProfileRequest,
} from './User/IUserRequests';

// Category Domain Types
export type {
    CategoryResponse,
} from './Category/ICategoryResponses';
export type {
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from './Category/ICategoryRequests';

// Activity Domain Types
export type {
    ActivityResponse,
    ActivityValueDefinitionResponse,
    ActivityErrorResponse,
} from './Activity/IActivityResponses';
export type {
    CreateActivityRequest,
    UpdateActivityRequest,
    CreateValueDefinitionRequest,
} from './Activity/IActivityRequests';

// Activity Value Definitions States
export type {
    IActivityValueDefinitionsState,
    IValueDefinitionCreateFormState,
} from './IStates';
export {
    initialActivityValueDefinitionsState,
    initialValueDefinitionCreateFormState,
} from './IStates';

// Activity Logs Domain Types
export type {
    ActivityLogResponse,
    LogValueResponse,
} from './ActivityLog/IActivityLogResponses';
export type {
    StartActivityLogRequest,
    UpdateActivityLogRequest,
    LogValueRequest,
} from './ActivityLog/IActivityLogRequests';

// Activity Logs States
export type {
    IActivityLogsListState,
    IActivityLogDetailState,
} from './IStates';
export {
    initialActivityLogsListState,
    initialActivityLogDetailState,
} from './IStates';
