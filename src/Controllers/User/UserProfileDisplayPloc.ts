/**
 * CONTROLLER LAYER - UserProfileDisplayPloc
 * PLOC para mostrar el perfil del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IUserProfileDisplayState,
  initialUserProfileDisplayState,
} from '../../Domain'
import type { GetUserProfileUseCase } from '../../Application/UseCases/User'
import type { AuthPloc } from '../Auth/AuthPloc'

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
      error: null,
    })

    try {
      const result = await this.getUserProfileUseCase.execute()

      if (result.success) {
        // Actualizar la sesión con los datos del usuario
        await this.authPloc.updateUserSession({
          name: result.user.name,
          email: result.user.email,
        })

        this.changeState({
          ...this.state,
          user: result.user,
          isLoading: false,
          error: null,
        })
        return
      }

      this.changeState({
        ...this.state,
        user: null,
        isLoading: false,
        error: result.error,
      })
    } catch (err: unknown) {
      const error =
        err instanceof Error
          ? { title: 'Error', detail: err.message }
          : { title: 'Error', detail: 'Error desconocido al cargar el perfil' }

      this.changeState({
        ...this.state,
        user: null,
        isLoading: false,
        error,
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialUserProfileDisplayState)
  }
}
