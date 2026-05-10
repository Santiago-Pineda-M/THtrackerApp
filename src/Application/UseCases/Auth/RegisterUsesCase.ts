/**
 * APPLICATION LAYER - RegisterUseCase
 * Caso de uso para registrar un nuevo usuario.
 * La API solo tiene /register — no existe confirmEmail ni resend.
 */

import type { IUseCase, ApiAuthTypes } from '../../../Domain'
import type { IAuthService } from '../../Services/Auth/IAuthService'

type RegisterCommand = ApiAuthTypes['RegisterCommand']
type UserResponse = ApiAuthTypes['UserResponse']
type ProblemDetails = ApiAuthTypes['ProblemDetails']

export type RegisterOutput = UserResponse | ProblemDetails

export class RegisterUseCases implements IUseCase<
  RegisterCommand,
  RegisterOutput
> {
  private readonly authService: IAuthService
  constructor(authService: IAuthService) {
    this.authService = authService
  }

  async execute(input: RegisterCommand): Promise<RegisterOutput> {
    return this.authService.register(input)
  }
}
