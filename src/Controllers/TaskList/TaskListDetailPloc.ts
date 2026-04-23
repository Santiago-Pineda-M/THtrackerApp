/**
 * CONTROLLER LAYER - TaskListDetailPloc
 * PLOC para mostrar los detalles de una lista de tareas individual.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskListDetailState,
  initialTaskListDetailState,
} from '../../Domain'
import type { GetTaskListByIdUseCase } from '../../Application/UseCases/TaskList/GetTaskListByIdUseCase'

export class TaskListDetailPloc extends Ploc<ITaskListDetailState> {
  private readonly getTaskListByIdUseCase: GetTaskListByIdUseCase

  constructor(getTaskListByIdUseCase: GetTaskListByIdUseCase) {
    super(initialTaskListDetailState)
    this.getTaskListByIdUseCase = getTaskListByIdUseCase
  }

  /**
   * Carga una lista de tareas por su ID.
   */
  async loadTaskList(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      error: null,
    })

    try {
      const result = await this.getTaskListByIdUseCase.execute({ id })

      if (result.success) {
        this.changeState({
          ...this.state,
          taskList: result.taskList,
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        taskList: null,
        isLoading: false,
        error: result.error,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        taskList: null,
        isLoading: false,
        error: { title: 'Error', detail: message },
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTaskListDetailState)
  }
}
