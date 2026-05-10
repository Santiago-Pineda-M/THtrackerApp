/**
 * DOMAIN LAYER - Barrel Exports
 * Punto de entrada único para importar desde la capa de Dominio.
 * Solo exports relacionados con autenticación.
 */

// Entities
export {
  AuthSession,
  type AuthSessionProps,
  type UserData,
} from './Entities/AuthSession'
export { SidebarState, type SidebarStateProps } from './Entities/SidebarState'

// Value Objects
export {
  Email,
  AuthTokens,
  decodeJwtExp,
  isoToExpiresInSeconds,
} from './ValueObjects'
export { UserId } from './ValueObjects/UserId'

// Repositories
export type { IAuthSessionRepository } from './Repositories/IAuthSessionRepository'
export type { ISidebarRepository } from './Repositories/ISidebarRepository'

// Pattern Interfaces
export {
  type IUseCase,
  type IHttpClient,
  type HttpRequestConfig,
  type ISecureStorage,
  type IStorage,
  type HttpResponse,
} from './IPatterns'

// States & Enums
export * from './IStates'

// Domain Services
export {
  LoginValidator,
  RegisterValidator,
  AuthValidationService,
  type ValidationError,
  type ValidationResult,
  type LoginRequestData,
  type RegisterRequestData,
} from './Services'
export type { IDateProvider } from './Services/IDateProvider'

// Base PLOC
export { Ploc } from './Ploc'

// Activity Value Definitions States
export type {
  IActivityValueDefinitionsState,
  IValueDefinitionCreateFormState,
} from './IStates'
export {
  initialActivityValueDefinitionsState,
  initialValueDefinitionCreateFormState,
} from './IStates'

// Activity Logs States
export type {
  IActivityLogsListState,
  IActivityLogDetailState,
  IActiveActivityLogsState,
  IActivityLogStartState,
  IActivityLogStopState,
  ICalendarLogsState,
} from './IStates'
export {
  initialActivityLogsListState,
  initialActivityLogDetailState,
  initialActiveActivityLogsState,
  initialActivityLogStartState,
  initialActivityLogStopState,
  initialCalendarLogsState,
} from './IStates'

// UserSession States
export type { IUserSessionsListState, ISessionRevokeState } from './IStates'
export {
  initialUserSessionsListState,
  initialSessionRevokeState,
} from './IStates'

// Domain Events
export * from './Events'

// api tipes

export * from './api'
