/**
 * INFRASTRUCTURE LAYER - UserSessionService
 * Implementación de IUserSessionService que conecta con el API de sesiones de usuario.
 */

import type { IHttpClient, ApiUserSessionTypes } from '../../../Domain'
import type { IUserSessionService } from './IUserSessionService'

type ProblemDetails = ApiUserSessionTypes['ProblemDetails']
type UserSessionResponsePaginated =
  ApiUserSessionTypes['UserSessionResponsePaginated']
type GetUserSessionsFilters = ApiUserSessionTypes['GetUserSessionsFilters']
type RevokeSessionIdPath = ApiUserSessionTypes['RevokeSessionIdPath']

export class UserSessionService implements IUserSessionService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/sessions'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getUserSessions(
    filters: GetUserSessionsFilters
  ): Promise<UserSessionResponsePaginated | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        UserSessionResponsePaginated | ProblemDetails
      >(this.baseUrl, { cacheTtl: 5 * 60 * 1000, params: filters })
      if (response.status === 200)
        return response.data as UserSessionResponsePaginated
      throw new Error('Error al obtener las sesiones')
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error de conexión')
    }
  }

  async revokeSession(
    sessionId: RevokeSessionIdPath
  ): Promise<void | ProblemDetails> {
    try {
      const response = await this.httpClient.post<void | ProblemDetails>(
        `${this.baseUrl}/${sessionId}/revoke`
      )
      if (response.status === 204) return
      return response.data as ProblemDetails
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
