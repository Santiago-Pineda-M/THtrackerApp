/**
 * CONTROLLER LAYER - TaskListsPloc
 * PLOC para mostrar la lista de listas de tareas del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITaskListsState, initialTaskListsState } from '../../Domain'
import type {
  GetTaskListsUseCase,
  GetTaskListsResponse,
  ProblemDetails,
} from '../../Application/UseCases/TaskList/GetTaskListsUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

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
      errors: {},
    })

    try {
      const result = await this.getTaskListsUseCase.execute({
        pageNumber: 0,
        pageSize: 100,
      })

      if (this.isTaskListsSuccess(result)) {
        this.changeState({
          ...this.state,
          taskLists: result,
          isLoading: false,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        taskLists: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar las listas de tareas'
      this.changeState({
        ...this.state,
        taskLists: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  private isTaskListsSuccess(
    result: GetTaskListsResponse | ProblemDetails
  ): result is GetTaskListsResponse {
    return 'items' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTaskListsState)
  }
}
