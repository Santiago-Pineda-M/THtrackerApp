/**
 * APPLICATION LAYER - RevokeSessionUseCase
 * Caso de uso para revocar una sesión específica del usuario autenticado.
 */

import type { IUseCase, ApiUserSessionTypes } from '../../../Domain'
import type { IUserSessionService } from '../../Services/UserSession/IUserSessionService'

type ProblemDetails = ApiUserSessionTypes['ProblemDetails']
type RevokeSessionRequest = ApiUserSessionTypes['RevokeSessionIdPath']

type RevokeSessionOutput = void | ProblemDetails
/**
 * Caso de uso para revocar una sesión.
 * Utiliza el servicio de sesiones para enviar la solicitud a la API.
 */
export class RevokeSessionUseCase implements IUseCase<
  RevokeSessionRequest,
  RevokeSessionOutput
> {
  private readonly userSessionService: IUserSessionService

  constructor(userSessionService: IUserSessionService) {
    this.userSessionService = userSessionService
  }

  async execute(input: RevokeSessionRequest): Promise<RevokeSessionOutput> {
    const result = await this.userSessionService.revokeSession(input)
    return result
  }
}
