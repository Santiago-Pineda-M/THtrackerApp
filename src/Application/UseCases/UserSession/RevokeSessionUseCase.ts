/**
 * APPLICATION LAYER - RevokeSessionUseCase
 * Caso de uso para revocar una sesión específica del usuario autenticado.
 */

import type { IUseCase, ApiUserSessionTypes } from '../../../Domain'
import type { IUserSessionService } from '../../Services/UserSession/IUserSessionService'

export type ProblemDetails = ApiUserSessionTypes['ProblemDetails']
export type RevokeSessionRequest = ApiUserSessionTypes['RevokeSessionIdPath']

/**
 * Caso de uso para revocar una sesión.
 * Utiliza el servicio de sesiones para enviar la solicitud a la API.
 */
export class RevokeSessionUseCase implements IUseCase<
  RevokeSessionRequest,
  void | ProblemDetails
> {
  private readonly userSessionService: IUserSessionService

  constructor(userSessionService: IUserSessionService) {
    this.userSessionService = userSessionService
  }

  async execute(input: RevokeSessionRequest): Promise<void | ProblemDetails> {
    const result = await this.userSessionService.revokeSession(input)
    return result
  }
}
