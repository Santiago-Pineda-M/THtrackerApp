/**
 * CONTROLLER LAYER - TaskTogglePloc
 * PLOC para alternar el estado de completado de una tarea.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITaskToggleState, initialTaskToggleState } from '../../Domain'
import type {
  ToggleTaskUseCase,
  ToggleTaskResponse,
  ProblemDetails,
} from '../../Application/UseCases/Task/ToggleTaskUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class TaskTogglePloc extends Ploc<ITaskToggleState> {
  private readonly toggleTaskUseCase: ToggleTaskUseCase

  constructor(toggleTaskUseCase: ToggleTaskUseCase) {
    super(initialTaskToggleState)
    this.toggleTaskUseCase = toggleTaskUseCase
  }

  /**
   * Alterna el estado de completado de una tarea.
   */
  async toggle(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      taskId: id,
      isLoading: true,
      success: false,
      errors: {},
    })

    try {
      const result = await this.toggleTaskUseCase.execute({ id })

      if (this.isToggleTaskSuccess(result)) {
        this.changeState({
          ...this.state,
          isLoading: false,
          success: true,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        errors: mappedErrors,
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

  private isToggleTaskSuccess(
    result: ToggleTaskResponse | ProblemDetails
  ): result is ToggleTaskResponse {
    return 'id' in result && 'content' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTaskToggleState)
  }
}
