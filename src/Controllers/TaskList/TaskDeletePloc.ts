/**
 * CONTROLLER LAYER - TaskDeletePloc
 * PLOC para la eliminación de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITaskDeleteState, initialTaskDeleteState } from '../../Domain'
import type { DeleteTaskUseCase } from '../../Application/UseCases/Task/DeleteTaskUseCase'

export class TaskDeletePloc extends Ploc<ITaskDeleteState> {
  private readonly deleteTaskUseCase: DeleteTaskUseCase

  constructor(deleteTaskUseCase: DeleteTaskUseCase) {
    super(initialTaskDeleteState)
    this.deleteTaskUseCase = deleteTaskUseCase
  }

  /**
   * Elimina una tarea por su ID.
   */
  async deleteTask(id: string, taskListId: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      success: false,
      error: null,
    })

    try {
      const result = await this.deleteTaskUseCase.execute({ id, taskListId })

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
    this.changeState(initialTaskDeleteState)
  }
}
