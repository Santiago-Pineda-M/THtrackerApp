/**
 * INFRASTRUCTURE LAYER - UserSessionService
 * Implementación de IUserSessionService que conecta con el API de sesiones de usuario.
 */

import type {
  IHttpClient,
  IUserSessionResponse,
  IRevokeSessionResponse,
} from '../../Domain'
import type { IUserSessionService } from '../../Application/Services/UserSession/IUserSessionService'

export class UserSessionService implements IUserSessionService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/sessions'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getUserSessions(): Promise<IUserSessionResponse[]> {
    try {
      const response = await this.httpClient.get<IUserSessionResponse[]>(
        this.baseUrl
      )
      if (response.status === 200) return response.data
      throw new Error('Error al obtener las sesiones')
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error de conexión')
    }
  }

  async revokeSession(sessionId: string): Promise<IRevokeSessionResponse> {
    try {
      const response = await this.httpClient.post<void>(
        `${this.baseUrl}/${sessionId}/revoke`
      )
      if (response.status === 204) return { success: true }
      throw new Error('Error al revocar la sesión')
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error de conexión')
    }
  }

  async logout(): Promise<void> {
    try {
      const response = await this.httpClient.post<void>(
        `${this.baseUrl}/logout`
      )
      if (response.status !== 204) throw new Error('Error al cerrar sesión')
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error de conexión')
    }
  }
}
