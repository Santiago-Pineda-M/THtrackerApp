/**
 * APPLICATION LAYER - GetUserSessionsUseCase
 * Caso de uso para obtener todas las sesiones activas del usuario autenticado.
 */

import type { IUseCase, IUserSessionResponse } from '../../../Domain'
import type { IUserSessionService } from '../../Services/UserSession/IUserSessionService'

/**
 * Output del caso de uso.
 */
export interface GetUserSessionsOutput {
  sessions: IUserSessionResponse[]
}

/**
 * Caso de uso para obtener las sesiones activas del usuario.
 * Utiliza el servicio de sesiones para obtener los datos de la API.
 */
export class GetUserSessionsUseCase implements IUseCase<
  void,
  GetUserSessionsOutput
> {
  private readonly userSessionService: IUserSessionService

  constructor(userSessionService: IUserSessionService) {
    this.userSessionService = userSessionService
  }

  async execute(): Promise<GetUserSessionsOutput> {
    const sessions = await this.userSessionService.getUserSessions()
    return { sessions }
  }
}
