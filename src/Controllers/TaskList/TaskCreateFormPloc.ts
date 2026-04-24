/**
 * CONTROLLER LAYER - TaskCreateFormPloc
 * PLOC para el formulario de creación de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskCreateFormState,
  initialTaskCreateFormState,
} from '../../Domain'
import type { CreateTaskUseCase } from '../../Application/UseCases/Task/CreateTaskUseCase'
import type { ICreateTaskRequest } from '../../Domain/TaskList'

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
   * Envía el formulario de creación.
   */
  async submitCreate(request: ICreateTaskRequest): Promise<void> {
    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      const result = await this.createTaskUseCase.execute({
        ...request,
        dueDate: this.state.dueDate || undefined,
      })

      if (result.success) {
        this.changeState({
          ...initialTaskCreateFormState,
          success: true,
          message: 'Tarea creada correctamente.',
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        errors: {},
        success: false,
        message: result.error.title || 'Error al crear la tarea.',
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
   * Resetea el estado del formulario.
   */
  reset(): void {
    this.changeState(initialTaskCreateFormState)
  }
}
