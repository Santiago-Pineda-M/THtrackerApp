/**
 * CONTROLLER LAYER - TaskListCreateFormPloc
 * PLOC para el formulario de creación de listas de tareas.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ITaskListCreateFormState,
  initialTaskListCreateFormState,
} from '../../Domain'
import type {
  CreateTaskListUseCase,
  CreateTaskListResponse,
  ProblemDetails,
} from '../../Application/UseCases/TaskList/CreateTaskListUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class TaskListCreateFormPloc extends Ploc<ITaskListCreateFormState> {
  private readonly createTaskListUseCase: CreateTaskListUseCase

  constructor(createTaskListUseCase: CreateTaskListUseCase) {
    super(initialTaskListCreateFormState)
    this.createTaskListUseCase = createTaskListUseCase
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
   * Actualiza la descripción en el estado.
   */
  updateUserId(userId: string): void {
    this.changeState({
      ...this.state,
      userId,
      success: false,
      message: '',
    })
  }

  /**
   * Actualiza el color en el estado.
   */
  updateColor(color: string): void {
    this.changeState({
      ...this.state,
      color,
      success: false,
      message: '',
    })
  }

  /**
   * Envía el formulario de creación.
   * Primero valida localmente; si hay errores, no envía la petición.
   */
  async submitCreate(): Promise<void> {
    // Validación local antes de enviar
    const validationErrors = this.validateFormLocal()
    if (Object.keys(validationErrors).length > 0) {
      this.changeState({
        ...this.state,
        errors: validationErrors,
        success: false,
        message: 'Corrige los errores del formulario.',
      })
      return
    }

    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      const result = await this.createTaskListUseCase.execute({
        name: this.state.name,
        userId: this.state.userId,
        color: this.state.color,
      })

      if (this.isCreateTaskListSuccess(result)) {
        // Éxito: se resetea el formulario mostrando mensaje de confirmación
        this.changeState({
          ...initialTaskListCreateFormState,
          success: true,
          message: 'Lista de tareas creada correctamente.',
          isLoading: false,
        })
        return
      }

      // Error controlado (ProblemDetails)
      const mappedErrors = mapProblemDetailsToErrors(result)
      // console.log(mappedErrors)
      this.changeState({
        ...this.state,
        errors: mappedErrors,
        success: false,
        message: result.title || 'Error al crear la lista de tareas.',
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
   * CreateTaskListResponse debe tener una propiedad 'id' (o similar) que la diferencie.
   */
  private isCreateTaskListSuccess(
    result: CreateTaskListResponse | ProblemDetails
  ): result is CreateTaskListResponse {
    return 'id' in result
  }

  /**
   * Valida el formulario localmente y retorna los errores.
   * No modifica el estado, para mantener separada la validación de la actualización de UI.
   */
  private validateFormLocal(): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    if (!this.state.name || this.state.name.trim() === '') {
      errors.name = ['El nombre es requerido.']
    }

    // NOTA: Si la descripción es realmente requerida, descomenta esta validación.
    // Si es opcional en el dominio, elimínala para no bloquear envíos válidos.
    // if (!this.state.description || this.state.description.trim() === '') {
    //   errors.description = ['La descripción es requerida.']
    // }

    return errors
  }

  /**
   * Resetea el estado del formulario.
   */
  reset(): void {
    this.changeState(initialTaskListCreateFormState)
  }
}
