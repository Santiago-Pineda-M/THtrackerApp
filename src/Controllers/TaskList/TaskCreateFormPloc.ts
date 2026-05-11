/**
 * CONTROLLER LAYER - TaskCreateFormPloc
 * PLOC para el formulario de creación de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskCreateFormState,
  initialTaskCreateFormState,
} from '../../Domain'
import type {
  CreateTaskCommand,
  CreateTaskUseCase,
  ProblemDetails,
  TaskResponse,
} from '../../Application/UseCases/Task/CreateTaskUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class TaskCreateFormPloc extends Ploc<ITaskCreateFormState> {
  private readonly createTaskUseCase: CreateTaskUseCase

  constructor(createTaskUseCase: CreateTaskUseCase) {
    super(initialTaskCreateFormState)
    this.createTaskUseCase = createTaskUseCase
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
   * Si se activa, establece por defecto una hora después de la actual.
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
   * Envía el formulario de creación.
   * @param request - Comando base con los datos de la tarea. Se complementa con la fecha de vencimiento opcional.
   */
  async submitCreate(request: CreateTaskCommand): Promise<void> {
    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      // Construir la fecha de vencimiento solo si está habilitada y es válida
      let dueDate: string | undefined = undefined
      if (this.state.showDueDate && this.state.dueDate) {
        try {
          dueDate = new Date(this.state.dueDate).toISOString()
        } catch {
          // Fecha inválida: se deja undefined
        }
      }

      const result = await this.createTaskUseCase.execute({
        ...request,
        dueDate,
      })

      if (this.isTaskResponse(result)) {
        // Éxito: se resetea el formulario mostrando mensaje de éxito
        this.changeState({
          ...initialTaskCreateFormState,
          success: true,
          message: 'Tarea creada correctamente.',
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
        message: result.title || 'Error al crear la tarea.',
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
   */
  private isTaskResponse(
    result: TaskResponse | ProblemDetails
  ): result is TaskResponse {
    return 'id' in result
  }

  /**
   * Resetea el estado del formulario.
   */
  reset(): void {
    this.changeState(initialTaskCreateFormState)
  }
}
