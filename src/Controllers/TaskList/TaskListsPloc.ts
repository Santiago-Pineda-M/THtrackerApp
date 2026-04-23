/**
 * CONTROLLER LAYER - TaskListsPloc
 * PLOC para mostrar la lista de listas de tareas del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITaskListsState, initialTaskListsState } from '../../Domain'
import type { GetTaskListsUseCase } from '../../Application/UseCases/TaskList/GetTaskListsUseCase'

export class TaskListsPloc extends Ploc<ITaskListsState> {
  private readonly getTaskListsUseCase: GetTaskListsUseCase

  constructor(getTaskListsUseCase: GetTaskListsUseCase) {
    super(initialTaskListsState)
    this.getTaskListsUseCase = getTaskListsUseCase
  }

  /**
   * Carga todas las listas de tareas del usuario autenticado.
   */
  async loadTaskLists(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      error: null,
    })

    try {
      const result = await this.getTaskListsUseCase.execute({})

      if (result.success) {
        this.changeState({
          ...this.state,
          taskLists: result.taskLists,
          isLoading: false,
          error: null,
        })
        return
      }

      this.changeState({
        ...this.state,
        taskLists: [],
        isLoading: false,
        error: result.error,
      })
    } catch (err: unknown) {
      const error =
        err instanceof Error
          ? { title: 'Error', detail: err.message }
          : {
              title: 'Error',
              detail: 'Error desconocido al cargar las listas de tareas',
            }

      this.changeState({
        ...this.state,
        taskLists: [],
        isLoading: false,
        error,
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTaskListsState)
  }
}
