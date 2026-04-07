/**
 * APPLICATION LAYER - GetUserProfileUseCase
 * Caso de uso para obtener el perfil del usuario autenticado.
 */

import type { IUseCase } from '../../../Domain'
import type { IUserService } from '../../Services/User/IUserService'
import type { UserProfileResponse, ProblemDetails } from '../../../Domain'

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type GetUserProfileOutput =
  | { success: true; user: UserProfileResponse }
  | { success: false; error: ProblemDetails }

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
