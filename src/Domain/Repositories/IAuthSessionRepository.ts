import { AuthSession } from '../Entities/AuthSession'

export interface IAuthSessionRepository {
  /**
   * Obtiene la sesión de autenticación persistida.
   * @returns La sesión activa o null si no existe.
   */
  getSession(): Promise<AuthSession | null>

  /**
   * Persiste la sesión de autenticación.
   * @param session La sesión a guardar.
   */
  saveSession(session: AuthSession): Promise<void>

  /**
   * Elimina la sesión de autenticación (logout).
   */
  clearSession(): Promise<void>
}
