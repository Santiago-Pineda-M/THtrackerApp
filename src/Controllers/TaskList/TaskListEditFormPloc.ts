/**
 * CONTROLLER LAYER - TaskListEditFormPloc
 * PLOC para el formulario de edición de listas de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskListEditFormState,
  initialTaskListEditFormState,
} from '../../Domain'
import type { GetTaskListByIdUseCase } from '../../Application/UseCases/TaskList/GetTaskListByIdUseCase'
import type { UpdateTaskListUseCase } from '../../Application/UseCases/TaskList/UpdateTaskListUseCase'
import type { IUpdateTaskListRequest } from '../../Domain/TaskList'

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

      if (result.success) {
        this.changeState({
          ...this.state,
          id: result.taskList.id,
          name: result.taskList.name,
          description: result.taskList.description,
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        errors: {
          general: [
            result.error.detail || 'Error al cargar la lista de tareas',
          ],
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
   * Actualiza el nombre en el estado.
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
   * Actualiza la descripción en el estado.
   */
  updateDescription(description: string | null): void {
    this.changeState({
      ...this.state,
      description,
      success: false,
      message: '',
    })
  }

  /**
   * Envía el formulario de edición.
   */
  async submitEdit(request: IUpdateTaskListRequest): Promise<void> {
    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      const result = await this.updateTaskListUseCase.execute(request)

      if (result.success) {
        this.changeState({
          ...this.state,
          success: true,
          message: 'Lista de tareas actualizada correctamente.',
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        errors: {},
        success: false,
        message:
          result.error.title || 'Error al actualizar la lista de tareas.',
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
    this.changeState(initialTaskListEditFormState)
  }
}
