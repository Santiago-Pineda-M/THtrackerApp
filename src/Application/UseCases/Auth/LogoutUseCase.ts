/**
 * APPLICATION LAYER - LogoutUseCase
 * Caso de uso para cerrar sesión.
 * El servidor no tiene endpoint de logout, solo limpiamos la sesión local.
 * Adicionalmente limpia el caché HTTP para que no queden datos del usuario
 * en memoria si otro usuario inicia sesión en el mismo tab.
 */

import type {
  IUseCase,
  IAuthSessionRepository,
  IHttpClient,
} from '../../../Domain'

export class LogoutUseCase implements IUseCase<void, void> {
  private readonly authSessionRepo: IAuthSessionRepository
  private readonly httpClient: IHttpClient

  constructor(
    authSessionRepo: IAuthSessionRepository,
    httpClient: IHttpClient
  ) {
    this.authSessionRepo = authSessionRepo
    this.httpClient = httpClient
  }

  async execute(): Promise<void> {
    await this.authSessionRepo.clearSession()
    this.httpClient.clearCache()
  }
}
