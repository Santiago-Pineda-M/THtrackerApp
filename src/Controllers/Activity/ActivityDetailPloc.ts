/**
 * CONTROLLER LAYER - ActivityDetailPloc
 * PLOC para mostrar los detalles de una actividad individual.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IActivityDetailState,
  initialActivityDetailState,
} from '../../Domain'
import type {
  GetActivityByIdUseCase,
  ActivityResponse,
  ProblemDetails,
} from '../../Application/UseCases/Activity/GetActivityByIdUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class ActivityDetailPloc extends Ploc<IActivityDetailState> {
  private readonly getActivityByIdUseCase: GetActivityByIdUseCase

  constructor(getActivityByIdUseCase: GetActivityByIdUseCase) {
    super(initialActivityDetailState)
    this.getActivityByIdUseCase = getActivityByIdUseCase
  }

  /**
   * Carga una actividad por su ID.
   */
  async loadActivity(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getActivityByIdUseCase.execute({ id })

      if (this.isActivitySuccess(result)) {
        this.changeState({
          ...this.state,
          activity: result,
          isLoading: false,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        activity: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        activity: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  private isActivitySuccess(
    result: ActivityResponse | ProblemDetails
  ): result is ActivityResponse {
    return 'id' in result && 'name' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialActivityDetailState)
  }
}
