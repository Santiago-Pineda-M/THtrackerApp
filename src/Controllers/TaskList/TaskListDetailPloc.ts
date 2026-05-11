/**
 * CONTROLLER LAYER - TaskListDetailPloc
 * PLOC para mostrar los detalles de una lista de tareas individual.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskListDetailState,
  initialTaskListDetailState,
} from '../../Domain'
import type {
  GetTaskListByIdUseCase,
  ProblemDetails,
  TaskListResponse,
} from '../../Application/UseCases/TaskList/GetTaskListByIdUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

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
      errors: {},
    })

    try {
      const result = await this.getTaskListByIdUseCase.execute({ id })

      if (this.isTaskListDetailSuccess(result)) {
        this.changeState({
          ...this.state,
          taskList: result,
          isLoading: false,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        taskList: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        taskList: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  private isTaskListDetailSuccess(
    result: TaskListResponse | ProblemDetails
  ): result is TaskListResponse {
    return 'id' in result && 'name' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTaskListDetailState)
  }
}
