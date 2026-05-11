import { Ploc } from '../../Domain/Ploc'
import {
  type IActivityDeleteState,
  initialActivityDeleteState,
} from '../../Domain'
import type {
  DeleteActivityUseCase,
  ProblemDetails,
} from '../../Application/UseCases/Activity/DeleteActivityUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class ActivityDeletePloc extends Ploc<IActivityDeleteState> {
  private readonly deleteActivityUseCase: DeleteActivityUseCase

  constructor(deleteActivityUseCase: DeleteActivityUseCase) {
    super(initialActivityDeleteState)
    this.deleteActivityUseCase = deleteActivityUseCase
  }

  /**
   * Elimina una actividad por su ID.
   */
  async deleteActivity(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      success: false,
      errors: {},
    })

    try {
      const result = await this.deleteActivityUseCase.execute({ id })

      if (this.isActivityDeleteError(result)) {
        const mappedErrors = mapProblemDetailsToErrors(result)
        this.changeState({
          ...this.state,
          isLoading: false,
          success: false,
          errors: mappedErrors,
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        success: true,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        errors: { general: [message] },
      })
    }
  }

  /**
   * Type guard para verificar si el resultado es un error.
   */
  private isActivityDeleteError(
    result: void | ProblemDetails
  ): result is ProblemDetails {
    return typeof result === 'object' && result !== null && 'type' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialActivityDeleteState)
  }
}
