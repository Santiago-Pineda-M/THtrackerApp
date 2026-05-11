/**
 * CONTROLLER LAYER - ActivitiesListPloc
 * PLOC para mostrar la lista de actividades del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IActivitiesListState,
  initialActivitiesListState,
} from '../../Domain'
import {
  type GetActivitiesUseCase,
  type ActivityPaginatedResponse,
  type ProblemDetails,
} from '../../Application/UseCases/Activity/GetActivitiesUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class ActivitiesListPloc extends Ploc<IActivitiesListState> {
  private readonly getActivitiesUseCase: GetActivitiesUseCase

  constructor(getActivitiesUseCase: GetActivitiesUseCase) {
    super(initialActivitiesListState)
    this.getActivitiesUseCase = getActivitiesUseCase
  }

  /**
   * Carga todas las actividades del usuario autenticado.
   */
  async loadActivities(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getActivitiesUseCase.execute({
        pageNumber: 1,
        pageSize: 10,
      })

      if (this.isActivitiesSuccess(result)) {
        this.changeState({
          ...this.state,
          activities: result,
          isLoading: false,
          errors: {},
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        activities: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar las actividades'
      this.changeState({
        ...this.state,
        activities: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  private isActivitiesSuccess(
    result: ActivityPaginatedResponse | ProblemDetails
  ): result is ActivityPaginatedResponse {
    return 'items' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialActivitiesListState)
  }
}
