/**
 * APPLICATION LAYER - UserSession Service Interface
 * Puerto para el servicio de sesiones de usuario.
 * Refleja los 2 endpoints que existen en la API para sesiones.
 */

import type {
  IUserSessionResponse,
  IRevokeSessionResponse,
} from '../../../Domain'

/**
 * Contrato del servicio de sesiones de usuario.
 * Implementado en Infrastructure por UserSessionService.
 */
export interface IUserSessionService {
  /** Obtiene todas las sesiones activas del usuario autenticado. */
  getUserSessions(): Promise<IUserSessionResponse[]>

  /** Revoca una sesión específica del usuario autenticado. */
  revokeSession(sessionId: string): Promise<IRevokeSessionResponse>
}
