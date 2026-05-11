/**
 * APPLICATION LAYER - GetUserSessionsUseCase
 * Caso de uso para obtener todas las sesiones activas del usuario autenticado.
 */

import type { IUseCase, ApiUserSessionTypes } from '../../../Domain'
import type { IUserSessionService } from '../../Services/UserSession/IUserSessionService'

/**
 * Output del caso de uso.
 */
export type ProblemDetails = ApiUserSessionTypes['ProblemDetails']
export type UserSessionResponsePaginated =
  ApiUserSessionTypes['UserSessionResponsePaginated']
export type GetUserSessionsRequest =
  ApiUserSessionTypes['GetUserSessionsFilters']

/**
 * Caso de uso para obtener las sesiones activas del usuario.
 * Utiliza el servicio de sesiones para obtener los datos de la API.
 */
export class GetUserSessionsUseCase implements IUseCase<
  GetUserSessionsRequest,
  void | ProblemDetails
> {
  private readonly userSessionService: IUserSessionService

  constructor(userSessionService: IUserSessionService) {
    this.userSessionService = userSessionService
  }

  async execute(
    request: GetUserSessionsRequest
  ): Promise<UserSessionResponsePaginated | ProblemDetails> {
    const sessions = await this.userSessionService.getUserSessions(request)
    return sessions
  }
}
