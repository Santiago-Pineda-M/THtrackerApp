/**
 * APPLICATION LAYER - GetUserSessionsUseCase
 * Caso de uso para obtener todas las sesiones activas del usuario autenticado.
 */

import type { IUseCase, ApiUserSessionTypes } from '../../../Domain'
import type { IUserSessionService } from '../../Services/UserSession/IUserSessionService'

/**
 * Output del caso de uso.
 */
type ProblemDetails = ApiUserSessionTypes['ProblemDetails']
type UserSessionResponsePaginated =
  ApiUserSessionTypes['UserSessionResponsePaginated']
type GetUserSessionsRequest = ApiUserSessionTypes['GetUserSessionsFilters']

export type GetUserSessionsOutput =
  | UserSessionResponsePaginated
  | ProblemDetails

/**
 * Caso de uso para obtener las sesiones activas del usuario.
 * Utiliza el servicio de sesiones para obtener los datos de la API.
 */
export class GetUserSessionsUseCase implements IUseCase<
  GetUserSessionsRequest,
  GetUserSessionsOutput
> {
  private readonly userSessionService: IUserSessionService

  constructor(userSessionService: IUserSessionService) {
    this.userSessionService = userSessionService
  }

  async execute(
    request: GetUserSessionsRequest
  ): Promise<GetUserSessionsOutput> {
    const sessions = await this.userSessionService.getUserSessions(request)
    return sessions
  }
}
