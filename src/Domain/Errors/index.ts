/**
 * DOMAIN LAYER - Domain Errors
 * Errores específicos del dominio usando discriminated unions.
 */

export type DomainErrorKind =
  | 'ValidationError'
  | 'AuthenticationError'
  | 'AuthorizationError'
  | 'NotFoundError'
  | 'ConflictError'
  | 'DomainInvariantError'

export interface DomainError {
  kind: DomainErrorKind
  message: string
  code?: string
}

export interface ValidationError extends DomainError {
  kind: 'ValidationError'
  field: string
  details?: Record<string, unknown>
}

export interface AuthenticationError extends DomainError {
  kind: 'AuthenticationError'
  code?: 'invalid_credentials' | 'session_expired' | 'token_invalid'
}

export interface AuthorizationError extends DomainError {
  kind: 'AuthorizationError'
  code?: 'forbidden' | 'insufficient_permissions'
}

export interface NotFoundError extends DomainError {
  kind: 'NotFoundError'
  resource: string
  resourceId: string
}

export interface ConflictError extends DomainError {
  kind: 'ConflictError'
  code?: 'duplicate' | 'concurrency'
}

export interface DomainInvariantError extends DomainError {
  kind: 'DomainInvariantError'
  invariant: string
}

export type AnyDomainError =
  | ValidationError
  | AuthenticationError
  | AuthorizationError
  | NotFoundError
  | ConflictError
  | DomainInvariantError

export function isDomainError(value: unknown): value is AnyDomainError {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return typeof obj.kind === 'string' && typeof obj.message === 'string'
}
