/**
 * APPLICATION LAYER - LogoutUseCase
 * Caso de uso para cerrar sesión.
 * El servidor no tiene endpoint de logout, solo limpiamos la sesión local.
 */

import type { IUseCase, IAuthSessionRepository } from '../../../Domain'

export class LogoutUseCase implements IUseCase<void, void> {
  private readonly authSessionRepo: IAuthSessionRepository

  constructor(authSessionRepo: IAuthSessionRepository) {
    this.authSessionRepo = authSessionRepo
  }

  async execute(): Promise<void> {
    await this.authSessionRepo.clearSession()
  }
}
