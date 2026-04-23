/**
 * CONTROLLER LAYER - TaskListDeletePloc
 * PLOC para la eliminación de listas de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskListDeleteState,
  initialTaskListDeleteState,
} from '../../Domain'
import type { DeleteTaskListUseCase } from '../../Application/UseCases/TaskList/DeleteTaskListUseCase'

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
      error: null,
    })

    try {
      const result = await this.deleteTaskListUseCase.execute({ id })

      if (result.success) {
        this.changeState({
          ...this.state,
          isLoading: false,
          success: true,
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        error: result.error,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        error: { title: 'Error', detail: message },
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTaskListDeleteState)
  }
}
