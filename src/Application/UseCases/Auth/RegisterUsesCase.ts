/**
 * APPLICATION LAYER - RegisterUseCase
 * Caso de uso para registrar un nuevo usuario.
 * La API solo tiene /register — no existe confirmEmail ni resend.
 */

import type {
  IUseCase,
  IRegisterRequest,
  IRegisterResponse,
  ILoginResponseError,
} from '../../../Domain'
import type { IAuthService } from '../../Services/Auth/IAuthService'

export type RegisterOutput = IRegisterResponse | ILoginResponseError

export class RegisterUseCases implements IUseCase<
  IRegisterRequest,
  RegisterOutput
> {
  private readonly authService: IAuthService
  constructor(authService: IAuthService) {
    this.authService = authService
  }

  async execute(input: IRegisterRequest): Promise<RegisterOutput> {
    return this.authService.register(input)
  }
}
