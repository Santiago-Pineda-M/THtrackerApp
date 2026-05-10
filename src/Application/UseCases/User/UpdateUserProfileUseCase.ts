/**
 * APPLICATION LAYER - UpdateUserProfileUseCase
 * Caso de uso para actualizar el perfil del usuario autenticado.
 */

import type { IUseCase, ApiUserTypes } from '../../../Domain'
import type { IUserService } from '../../Services/User/IUserService'

type UpdateUserProfileRequest = ApiUserTypes['UpdateUserCommand']
type UserResponse = ApiUserTypes['UserResponse']
type ProblemDetails = ApiUserTypes['ProblemDetails']

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type UpdateUserProfileOutput = UserResponse | ProblemDetails

/**
 * Caso de uso para actualizar el perfil del usuario autenticado.
 * PUT /api/v1/users/me
 */
export class UpdateUserProfileUseCase implements IUseCase<
  UpdateUserProfileRequest,
  UpdateUserProfileOutput
> {
  private readonly userService: IUserService

  constructor(userService: IUserService) {
    this.userService = userService
  }

  async execute(
    input: UpdateUserProfileRequest
  ): Promise<UpdateUserProfileOutput> {
    const result = await this.userService.updateProfile(input)
    return result
  }
}
