/**
 * CONTROLLER LAYER - TaskEditFormPloc
 * PLOC para el formulario de edición de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITaskEditFormState, initialTaskEditFormState } from '../../Domain'
import type { GetTaskByIdUseCase } from '../../Application/UseCases/Task/GetTaskByIdUseCase'
import type { UpdateTaskUseCase } from '../../Application/UseCases/Task/UpdateTaskUseCase'
import type { IUpdateTaskRequest } from '../../Domain/TaskList'

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

      if (result.success) {
        this.changeState({
          ...this.state,
          id: result.task.id,
          taskListId: result.task.taskListId,
          content: result.task.content,
          dueDate: result.task.dueDate || '',
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        errors: {
          general: [result.error.detail || 'Error al cargar la tarea'],
        },
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
   * Envía el formulario de edición.
   */
  async submitEdit(request: IUpdateTaskRequest): Promise<void> {
    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      const result = await this.updateTaskUseCase.execute({
        ...request,
        dueDate: this.state.dueDate || undefined,
      })

      if (result.success) {
        this.changeState({
          ...this.state,
          success: true,
          message: 'Tarea actualizada correctamente.',
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        errors: {},
        success: false,
        message: result.error.title || 'Error al actualizar la tarea.',
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
    this.changeState(initialTaskEditFormState)
  }
}
