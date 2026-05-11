/**
 * CONTROLLER LAYER - UserProfileDisplayPloc
 * PLOC para mostrar el perfil del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IUserProfileDisplayState,
  initialUserProfileDisplayState,
} from '../../Domain'
import type {
  GetUserProfileUseCase,
  UserProfileResponse,
  ProblemDetails,
} from '../../Application/UseCases/User/GetUserProfileUseCase'
import type { AuthPloc } from '../Auth/AuthPloc'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class UserProfileDisplayPloc extends Ploc<IUserProfileDisplayState> {
  private readonly getUserProfileUseCase: GetUserProfileUseCase
  private readonly authPloc: AuthPloc

  constructor(
    getUserProfileUseCase: GetUserProfileUseCase,
    authPloc: AuthPloc
  ) {
    super(initialUserProfileDisplayState)
    this.getUserProfileUseCase = getUserProfileUseCase
    this.authPloc = authPloc
  }

  /**
   * Carga el perfil del usuario autenticado.
   */
  async loadProfile(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getUserProfileUseCase.execute()

      if (this.isUserProfileSuccess(result)) {
        // Actualizar la sesión con los datos del usuario
        await this.authPloc.updateUserSession({
          name: result.name,
          email: result.email,
        })

        this.changeState({
          ...this.state,
          user: result,
          isLoading: false,
          errors: {},
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        user: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar el perfil'
      this.changeState({
        ...this.state,
        user: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  private isUserProfileSuccess(
    result: UserProfileResponse | ProblemDetails
  ): result is UserProfileResponse {
    return 'id' in result && 'email' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialUserProfileDisplayState)
  }
}
