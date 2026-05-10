/**
 * APPLICATION LAYER - UserSession Service Interface
 * Puerto para el servicio de sesiones de usuario.
 * Refleja los 3 endpoints que existen en la API para sesiones.
 */

import type { ApiUserSessionTypes } from '../../../Domain'

type ProblemDetails = ApiUserSessionTypes['ProblemDetails']
type UserSessionResponsePaginated =
  ApiUserSessionTypes['UserSessionResponsePaginated']
type GetUserSessionsFilters = ApiUserSessionTypes['GetUserSessionsFilters']
type RevokeSessionIdPath = ApiUserSessionTypes['RevokeSessionIdPath']

/**
 * Contrato del servicio de sesiones de usuario.
 * Implementado en Infrastructure por UserSessionService.
 */
export interface IUserSessionService {
  /** Obtiene todas las sesiones activas del usuario autenticado. */
  getUserSessions(
    filters: GetUserSessionsFilters
  ): Promise<UserSessionResponsePaginated | ProblemDetails>

  /** Revoca una sesión específica del usuario autenticado. */
  revokeSession(sessionId: RevokeSessionIdPath): Promise<void | ProblemDetails>

  /** Cierra la sesión actual del usuario. */
  logout(): Promise<void | ProblemDetails>
}
