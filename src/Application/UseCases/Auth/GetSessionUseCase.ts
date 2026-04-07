/**
 * APPLICATION LAYER - GetSessionUseCase
 * Caso de uso para obtener la sesión actual.
 * Simplemente recupera la sesión persistida sin validaciones.
 */

import type { IUseCase } from '../../../Domain'
import type { IAuthSessionRepository } from '../../../Domain'
import { AuthSession } from '../../../Domain/Entities/AuthSession'

/**
 * Output del caso de uso.
 */
export interface GetSessionOutput {
  session: AuthSession | null
}

/**
 * Caso de uso para obtener la sesión actual.
 * No valida si el token está expirado - solo retorna lo que hay guardado.
 */
export class GetSessionUseCase implements IUseCase<void, GetSessionOutput> {
  private readonly authSessionRepo: IAuthSessionRepository

  constructor(authSessionRepo: IAuthSessionRepository) {
    this.authSessionRepo = authSessionRepo
  }

  async execute(): Promise<GetSessionOutput> {
    const session = await this.authSessionRepo.getSession()
    return { session }
  }
}
