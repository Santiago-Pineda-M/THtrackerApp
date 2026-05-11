/**
 * CONTROLLER LAYER - TaskEditFormPloc
 * PLOC para el formulario de edición de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITaskEditFormState, initialTaskEditFormState } from '../../Domain'
import type {
  GetTaskByIdUseCase,
  TaskResponse,
  ProblemDetails as GetTaskByIdProblemDetails,
} from '../../Application/UseCases/Task/GetTaskByIdUseCase'
import type {
  UpdateTaskUseCase,
  UpdateTaskRequest,
  ProblemDetails as UpdateTaskProblemDetails,
} from '../../Application/UseCases/Task/UpdateTaskUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class TaskEditFormPloc extends Ploc<ITaskEditFormState> {
  private readonly getTaskByIdUseCase: GetTaskByIdUseCase
  private readonly updateTaskUseCase: UpdateTaskUseCase

  constructor(
    getTaskByIdUseCase: GetTaskByIdUseCase,
    updateTaskUseCase: UpdateTaskUseCase
  ) {
    super(initialTaskEditFormState)
    this.getTaskByIdUseCase = getTaskByIdUseCase
    this.updateTaskUseCase = updateTaskUseCase
  }

  /**
   * Carga una tarea por su ID para edición.
   */
  async loadForEdit(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getTaskByIdUseCase.execute({ id })

      if (this.isTaskResponse(result)) {
        let formattedDueDate = ''
        if (result.dueDate) {
          try {
            const date = new Date(result.dueDate)
            // Formato YYYY-MM-DDTHH:mm para input datetime-local
            formattedDueDate = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
          } catch {
            formattedDueDate = ''
          }
        }

        this.changeState({
          ...this.state,
          id: result.id!,
          taskListId: result.taskListId!,
          content: result.content!,
          dueDate: formattedDueDate,
          showDueDate: !!result.dueDate,
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
   * Actualiza el contenido en el estado.
   */
  updateContent(content: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.content
    this.changeState({
      ...this.state,
      content,
      errors: newErrors,
      success: false,
      message: '',
    })
  }

  /**
   * Actualiza la fecha de vencimiento en el estado.
   */
  updateDueDate(dueDate: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.dueDate
    this.changeState({
      ...this.state,
      dueDate,
      errors: newErrors,
      success: false,
      message: '',
    })
  }

  /**
   * Alterna la visualización de la fecha de vencimiento.
   */
  toggleShowDueDate(): void {
    const newShowDueDate = !this.state.showDueDate
    let newDueDate = this.state.dueDate

    if (newShowDueDate && !newDueDate) {
      const now = new Date()
      const defaultDate = new Date(now.getTime() + 60 * 60 * 1000)
      newDueDate = new Date(
        defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16)
    }

    this.changeState({
      ...this.state,
      showDueDate: newShowDueDate,
      dueDate: newDueDate,
    })
  }

  /**
   * Envía el formulario de edición.
   * @param request - Comando base con los datos actualizados (incluye id, taskListId, content, etc.)
   */
  async submitEdit(request: UpdateTaskRequest): Promise<void> {
    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      let dueDate: string | undefined = undefined
      if (this.state.showDueDate && this.state.dueDate) {
        try {
          dueDate = new Date(this.state.dueDate).toISOString()
        } catch {
          // Fecha inválida: se deja undefined
        }
      }

      const result = await this.updateTaskUseCase.execute({
        ...request,
        dueDate,
      })

      if (this.isTaskResponse(result)) {
        this.changeState({
          ...this.state,
          success: true,
          message: 'Tarea actualizada correctamente.',
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
        message: result.title || 'Error al actualizar la tarea.',
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
   * Type guard para distinguir una respuesta exitosa (TaskResponse) de un ProblemDetails.
   * TaskResponse contiene la propiedad 'id'; ProblemDetails no.
   */
  private isTaskResponse(
    result: TaskResponse | UpdateTaskProblemDetails | GetTaskByIdProblemDetails
  ): result is TaskResponse {
    return 'id' in result
  }

  /**
   * Resetea el estado del formulario.
   */
  reset(): void {
    this.changeState(initialTaskEditFormState)
  }
}
