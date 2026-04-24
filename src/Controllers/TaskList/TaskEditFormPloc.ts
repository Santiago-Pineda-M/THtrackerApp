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
        let formattedDueDate = ''
        if (result.task.dueDate) {
          try {
            const date = new Date(result.task.dueDate)
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
          id: result.task.id,
          taskListId: result.task.taskListId,
          content: result.task.content,
          dueDate: formattedDueDate,
          showDueDate: !!result.task.dueDate,
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
   */
  async submitEdit(request: IUpdateTaskRequest): Promise<void> {
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
          // Si la fecha es inválida
        }
      }

      const result = await this.updateTaskUseCase.execute({
        ...request,
        dueDate,
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
