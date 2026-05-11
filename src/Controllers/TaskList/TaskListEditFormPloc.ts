/**
 * CONTROLLER LAYER - TaskListEditFormPloc
 * PLOC para el formulario de edición de listas de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskListEditFormState,
  initialTaskListEditFormState,
} from '../../Domain'
import type {
  GetTaskListByIdUseCase,
  TaskListResponse,
  ProblemDetails as GetTaskListByIdProblemDetails,
} from '../../Application/UseCases/TaskList/GetTaskListByIdUseCase'
import type {
  UpdateTaskListUseCase,
  UpdateTaskListRequest,
  UpdateTaskListResponse,
  ProblemDetails as UpdateTaskListProblemDetails,
} from '../../Application/UseCases/TaskList/UpdateTaskListUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class TaskListEditFormPloc extends Ploc<ITaskListEditFormState> {
  private readonly getTaskListByIdUseCase: GetTaskListByIdUseCase
  private readonly updateTaskListUseCase: UpdateTaskListUseCase

  constructor(
    getTaskListByIdUseCase: GetTaskListByIdUseCase,
    updateTaskListUseCase: UpdateTaskListUseCase
  ) {
    super(initialTaskListEditFormState)
    this.getTaskListByIdUseCase = getTaskListByIdUseCase
    this.updateTaskListUseCase = updateTaskListUseCase
  }

  /**
   * Carga una lista de tareas por su ID para edición.
   */
  async loadForEdit(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getTaskListByIdUseCase.execute({ id })

      if (this.isTaskListResponse(result)) {
        this.changeState({
          ...this.state,
          id: result.id!,
          name: result.name!,
          color: result.color || '#000000', // Valor por defecto si es null
          isLoading: false,
        })
        return
      }

      // Error controlado (ProblemDetails)
      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  /**
   * Actualiza el nombre en el estado y limpia su error asociado.
   */
  updateName(name: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.name
    this.changeState({
      ...this.state,
      name,
      errors: newErrors,
      success: false,
      message: '',
    })
  }

  /**
   * Actualiza el color en el estado y limpia su error asociado.
   */
  updateColor(color: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.color
    this.changeState({
      ...this.state,
      color,
      errors: newErrors,
      success: false,
      message: '',
    })
  }

  async submitEdit(): Promise<void> {
    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    //construir el request a partir del estado actual
    const request: UpdateTaskListRequest = {
      id: this.state.id!,
      name: this.state.name,
      color: this.state.color,
    }

    try {
      const result = await this.updateTaskListUseCase.execute(request)

      if (this.isTaskListResponse(result)) {
        this.changeState({
          ...this.state,
          success: true,
          message: 'Lista de tareas actualizada correctamente.',
          isLoading: false,
        })
        return
      }

      // Error controlado (ProblemDetails)
      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        errors: mappedErrors,
        success: false,
        message: result.title || 'Error al actualizar la lista de tareas.',
        isLoading: false,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        errors: { general: [message] },
        success: false,
        message,
        isLoading: false,
      })
    }
  }

  /**
   * Type guard para distinguir una respuesta exitosa de un ProblemDetails.
   * Tanto TaskListResponse como UpdateTaskListResponse deben tener 'id'.
   */
  private isTaskListResponse(
    result:
      | TaskListResponse
      | UpdateTaskListResponse
      | GetTaskListByIdProblemDetails
      | UpdateTaskListProblemDetails
  ): result is TaskListResponse | UpdateTaskListResponse {
    return 'id' in result
  }

  /**
   * Resetea el estado del formulario.
   */
  reset(): void {
    this.changeState(initialTaskListEditFormState)
  }
}
