/**
 * CONTROLLER LAYER - TasksPloc
 * PLOC para mostrar la lista de tareas dentro de una lista de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITasksState, initialTasksState } from '../../Domain'
import type { GetTasksByListUseCase } from '../../Application/UseCases/Task/GetTasksByListUseCase'

export class TasksPloc extends Ploc<ITasksState> {
  private readonly getTasksByListUseCase: GetTasksByListUseCase

  constructor(getTasksByListUseCase: GetTasksByListUseCase) {
    super(initialTasksState)
    this.getTasksByListUseCase = getTasksByListUseCase
  }

  /**
   * Carga todas las tareas de una lista de tareas.
   */
  async loadTasks(taskListId: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      error: null,
    })

    try {
      const result = await this.getTasksByListUseCase.execute({ taskListId })

      if (result.success) {
        this.changeState({
          ...this.state,
          tasks: result.tasks,
          isLoading: false,
          error: null,
        })
        return
      }

      this.changeState({
        ...this.state,
        tasks: [],
        isLoading: false,
        error: result.error,
      })
    } catch (err: unknown) {
      const error =
        err instanceof Error
          ? { title: 'Error', detail: err.message }
          : {
              title: 'Error',
              detail: 'Error desconocido al cargar las tareas',
            }

      this.changeState({
        ...this.state,
        tasks: [],
        isLoading: false,
        error,
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTasksState)
  }
}
