/**
 * CONTROLLER LAYER - TaskListCreateFormPloc
 * PLOC para el formulario de creación de listas de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskListCreateFormState,
  initialTaskListCreateFormState,
} from '../../Domain'
import type { CreateTaskListUseCase } from '../../Application/UseCases/TaskList/CreateTaskListUseCase'

export class TaskListCreateFormPloc extends Ploc<ITaskListCreateFormState> {
  private readonly createTaskListUseCase: CreateTaskListUseCase

  constructor(createTaskListUseCase: CreateTaskListUseCase) {
    super(initialTaskListCreateFormState)
    this.createTaskListUseCase = createTaskListUseCase
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

  updateDescription(description: string | null): void {
    this.changeState({
      ...this.state,
      description,
      success: false,
      message: '',
    })
  }

  /**
   * Envía el formulario de creación.
   */
  async submitCreate(): Promise<void> {
    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      const result = await this.createTaskListUseCase.execute({
        name: this.state.name,
        description: this.state.description,
      })

      if (result.success) {
        this.changeState({
          ...initialTaskListCreateFormState,
          success: true,
          message: 'Lista de tareas creada correctamente.',
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        errors: {},
        success: false,
        message: result.error.title || 'Error al crear la lista de tareas.',
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
    this.changeState(initialTaskListCreateFormState)
  }
}
