/**
 * APPLICATION LAYER - UpdateUserProfileUseCase
 * Caso de uso para actualizar el perfil del usuario autenticado.
 */

import type { IUseCase, ApiUserTypes } from '../../../Domain'
import type { IUserService } from '../../Services/User/IUserService'

export type UpdateUserProfileCommand = ApiUserTypes['UpdateUserCommand']
export type UserResponse = ApiUserTypes['UserResponse']
export type ProblemDetails = ApiUserTypes['ProblemDetails']

/**
 * Caso de uso para actualizar el perfil del usuario autenticado.
 * PUT /api/v1/users/me
 */
export class UpdateUserProfileUseCase implements IUseCase<
  UpdateUserProfileCommand,
  UserResponse | ProblemDetails
> {
  private readonly userService: IUserService

  constructor(userService: IUserService) {
    this.userService = userService
  }

  async execute(
    input: UpdateUserProfileCommand
  ): Promise<UserResponse | ProblemDetails> {
    const result = await this.userService.updateProfile(input)
    return result
  }
}
