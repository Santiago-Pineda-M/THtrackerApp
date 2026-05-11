/**
 * CONTROLLER LAYER - TaskListDeletePloc
 * PLOC para la eliminación de listas de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskListDeleteState,
  initialTaskListDeleteState,
} from '../../Domain'
import type {
  DeleteTaskListUseCase,
  ProblemDetails,
} from '../../Application/UseCases/TaskList/DeleteTaskListUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class TaskListDeletePloc extends Ploc<ITaskListDeleteState> {
  private readonly deleteTaskListUseCase: DeleteTaskListUseCase

  constructor(deleteTaskListUseCase: DeleteTaskListUseCase) {
    super(initialTaskListDeleteState)
    this.deleteTaskListUseCase = deleteTaskListUseCase
  }

  /**
   * Elimina una lista de tareas por su ID.
   */
  async deleteTaskList(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      success: false,
      errors: {},
    })

    try {
      const result = await this.deleteTaskListUseCase.execute({ id })

      if (this.isTaskListDeleteError(result)) {
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
  private isTaskListDeleteError(
    result: ProblemDetails | void
  ): result is ProblemDetails {
    return typeof result === 'object' && result !== null && 'type' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTaskListDeleteState)
  }
}
