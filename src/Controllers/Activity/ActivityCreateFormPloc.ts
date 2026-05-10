/**
 * CONTROLLER LAYER - ActivityCreateFormPloc
 * PLOC para el formulario de creación de actividades.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IActivityCreateFormState,
  initialActivityCreateFormState,
} from '../../Domain'
import type { CreateActivityUseCase } from '../../Application/UseCases/Activity'

export class ActivityCreateFormPloc extends Ploc<IActivityCreateFormState> {
  private readonly createActivityUseCase: CreateActivityUseCase

  constructor(createActivityUseCase: CreateActivityUseCase) {
    super(initialActivityCreateFormState)
    this.createActivityUseCase = createActivityUseCase
  }

  /**
   * Actualiza el categoryId en el estado.
   */
  updateCategory(categoryId: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.categoryId
    this.changeState({
      ...this.state,
      categoryId,
      errors: newErrors,
      success: false,
      message: '',
    })
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
   * Actualiza la opción de permitir solapamiento.
   */
  updateAllowOverlap(allowOverlap: boolean): void {
    this.changeState({
      ...this.state,
      allowOverlap,
      success: false,
      message: '',
    })
  }

  /**
   * Envía el formulario de creación.
   */
  async submit(): Promise<void> {
    const validationErrors = this.validateForm()
    if (Object.keys(validationErrors).length > 0) {
      this.changeState({
        ...this.state,
        errors: validationErrors,
        success: false,
        message: 'Corrige los errores del formulario.',
        isLoading: false,
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
      const request = {
        categoryId: this.state.categoryId,
        name: this.state.name.trim() || null,
        color: this.state.color.trim() || null,
        allowOverlap: this.state.allowOverlap,
      }

      const result = await this.createActivityUseCase.execute(request)

      if (result.id) {
        this.changeState({
          ...initialActivityCreateFormState,
          success: true,
          message: 'Actividad creada correctamente.',
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        errors: result,
        success: false,
        message: 'Error al crear la actividad.',
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
    this.changeState(initialActivityCreateFormState)
  }

  private validateForm(): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    if (!this.state.categoryId || this.state.categoryId.trim() === '') {
      errors.categoryId = ['La categoría es requerida']
    }

    if (!this.state.name || this.state.name.trim() === '') {
      errors.name = ['El nombre de la actividad es requerido']
    }

    return errors
  }
}
