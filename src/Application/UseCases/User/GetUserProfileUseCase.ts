/**
 * APPLICATION LAYER - GetUserProfileUseCase
 * Caso de uso para obtener el perfil del usuario autenticado.
 */

import type { IUseCase, ApiUserTypes } from '../../../Domain'
import type { IUserService } from '../../Services/User/IUserService'

type UserProfileResponse = ApiUserTypes['UserResponse']
type ProblemDetails = ApiUserTypes['ProblemDetails']

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type GetUserProfileOutput = UserProfileResponse | ProblemDetails

/**
 * Caso de uso para obtener el perfil del usuario autenticado.
 * GET /api/v1/users/me
 */
export class GetUserProfileUseCase implements IUseCase<
  void,
  GetUserProfileOutput
> {
  private readonly userService: IUserService

  constructor(userService: IUserService) {
    this.userService = userService
  }

  async execute(): Promise<GetUserProfileOutput> {
    const result = await this.userService.getProfile()

    return result
  }
}
