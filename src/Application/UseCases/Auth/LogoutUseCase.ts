/**
 * APPLICATION LAYER - LogoutUseCase
 * Caso de uso para cerrar sesión.
 * Envía solicitud al endpoint /api/v1/sessions/logout del servidor.
 * Adicionalmente limpia la sesión local y el caché HTTP para que no queden
 * datos del usuario en memoria si otro usuario inicia sesión en el mismo tab.
 */

import type {
  IUseCase,
  IAuthSessionRepository,
  IHttpClient,
} from '../../../Domain'
import type { IUserSessionService } from '../../Services/UserSession/IUserSessionService'

export class LogoutUseCase implements IUseCase<void, void> {
  private readonly authSessionRepo: IAuthSessionRepository
  private readonly httpClient: IHttpClient
  private readonly userSessionService: IUserSessionService

  constructor(
    authSessionRepo: IAuthSessionRepository,
    httpClient: IHttpClient,
    userSessionService: IUserSessionService
  ) {
    this.authSessionRepo = authSessionRepo
    this.httpClient = httpClient
    this.userSessionService = userSessionService
  }

  async execute(): Promise<void> {
    try {
      await this.userSessionService.logout()
    } catch {
      // Ignoramos errores del logout en el servidor y limpiamos la sesión local
    }
    await this.authSessionRepo.clearSession()
    this.httpClient.clearCache()
  }
}
