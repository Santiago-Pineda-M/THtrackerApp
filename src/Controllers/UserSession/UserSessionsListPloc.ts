/**
 * CONTROLLER LAYER - UserSessionsListPloc
 * PLOC para mostrar la lista de sesiones activas del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IUserSessionsListState,
  initialUserSessionsListState,
} from '../../Domain'
import type {
  GetUserSessionsUseCase,
  UserSessionResponsePaginated,
  ProblemDetails,
} from '../../Application/UseCases/UserSession/GetUserSessionsUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class UserSessionsListPloc extends Ploc<IUserSessionsListState> {
  private readonly getUserSessionsUseCase: GetUserSessionsUseCase

  constructor(getUserSessionsUseCase: GetUserSessionsUseCase) {
    super(initialUserSessionsListState)
    this.getUserSessionsUseCase = getUserSessionsUseCase
  }

  /**
   * Carga todas las sesiones activas del usuario autenticado.
   */
  async loadSessions(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getUserSessionsUseCase.execute({})

      if (this.isUserSessionsSuccess(result)) {
        this.changeState({
          ...this.state,
          sessions: result,
          isLoading: false,
        })
        return
      }

      // Error controlado (ProblemDetails)
      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        // No sobrescribir sessions a null para evitar parpadeos en la UI
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar las sesiones'
      this.changeState({
        ...this.state,
        // Tampoco sobrescribir sessions a null en errores inesperados
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  /**
   * Type guard para verificar que la respuesta es exitosa (contiene 'items').
   */
  private isUserSessionsSuccess(
    result: UserSessionResponsePaginated | ProblemDetails
  ): result is UserSessionResponsePaginated {
    return 'items' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialUserSessionsListState)
  }
}
