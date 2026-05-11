/**
 * CONTROLLER LAYER - TasksPloc
 * PLOC para mostrar la lista de tareas dentro de una lista de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITasksState, initialTasksState } from '../../Domain'
import type {
  GetTasksByListUseCase,
  TaskPaginatedResponse,
  ProblemDetails,
} from '../../Application/UseCases/Task/GetTasksByListUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

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
      errors: {},
    })

    try {
      const result = await this.getTasksByListUseCase.execute({
        request: { taskListId },
        query: { pageNumber: 0, pageSize: 100 },
      })

      if (this.isTasksSuccess(result)) {
        this.changeState({
          ...this.state,
          tasks: result,
          isLoading: false,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        tasks: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar las tareas'
      this.changeState({
        ...this.state,
        tasks: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  private isTasksSuccess(
    result: TaskPaginatedResponse | ProblemDetails
  ): result is TaskPaginatedResponse {
    return 'items' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTasksState)
  }
}
