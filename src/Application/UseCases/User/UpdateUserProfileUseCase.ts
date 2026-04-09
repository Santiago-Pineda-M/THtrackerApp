/**
 * APPLICATION LAYER - UpdateUserProfileUseCase
 * Caso de uso para actualizar el perfil del usuario autenticado.
 */

import type { IUseCase } from '../../../Domain'
import type { IUserService } from '../../Services/User/IUserService'
import type {
  UpdateUserProfileRequest,
  UserProfileResponse,
  ProblemDetails,
} from '../../../Domain'

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type UpdateUserProfileOutput =
  | { success: true; user: UserProfileResponse }
  | { success: false; error: ProblemDetails }

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

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, user: result }
  }

  private isError(
    result: UserProfileResponse | ProblemDetails
  ): result is ProblemDetails {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
