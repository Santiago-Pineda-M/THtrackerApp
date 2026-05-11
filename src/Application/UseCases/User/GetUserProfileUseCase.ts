/**
 * APPLICATION LAYER - GetUserProfileUseCase
 * Caso de uso para obtener el perfil del usuario autenticado.
 */

import type { IUseCase, ApiUserTypes } from '../../../Domain'
import type { IUserService } from '../../Services/User/IUserService'

export type UserProfileResponse = ApiUserTypes['UserResponse']
export type ProblemDetails = ApiUserTypes['ProblemDetails']

/**
 * Caso de uso para obtener el perfil del usuario autenticado.
 * GET /api/v1/users/me
 */
export class GetUserProfileUseCase implements IUseCase<
  void,
  UserProfileResponse | ProblemDetails
> {
  private readonly userService: IUserService

  constructor(userService: IUserService) {
    this.userService = userService
  }

  async execute(): Promise<UserProfileResponse | ProblemDetails> {
    const result = await this.userService.getProfile()

    return result
  }
}
