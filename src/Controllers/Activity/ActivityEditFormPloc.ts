/**
 * CONTROLLER LAYER - ActivityEditFormPloc
 * PLOC para el formulario de edición de actividades.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IActivityEditFormState,
  initialActivityEditFormState,
} from '../../Domain'
import type {
  UpdateActivityUseCase,
  GetActivityByIdUseCase,
} from '../../Application/UseCases/Activity'

export class ActivityEditFormPloc extends Ploc<IActivityEditFormState> {
  private readonly updateActivityUseCase: UpdateActivityUseCase
  private readonly getActivityByIdUseCase: GetActivityByIdUseCase

  constructor(
    updateActivityUseCase: UpdateActivityUseCase,
    getActivityByIdUseCase: GetActivityByIdUseCase
  ) {
    super(initialActivityEditFormState)
    this.updateActivityUseCase = updateActivityUseCase
    this.getActivityByIdUseCase = getActivityByIdUseCase
  }

  /**
   * Inicializa el formulario con los datos de una actividad.
   */
  async loadActivity(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      id,
      isLoading: true,
      success: false,
      message: '',
      errors: {},
    })

    try {
      const result = await this.getActivityByIdUseCase.execute({ id })

      if (result.success) {
        const { categoryId, name, color, allowOverlap } = result.activity
        this.changeState({
          ...this.state,
          categoryId,
          name: name || '',
          color: color || '',
          allowOverlap,
          initialValues: {
            categoryId,
            name: name || '',
            color: color || '',
            allowOverlap,
          },
          isLoading: false,
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        message: result.error.title || 'No se pudo cargar la actividad.',
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        message,
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
   * Envía el formulario de actualización.
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
        id: this.state.id,
        name: this.state.name.trim() || null,
        color: this.state.color.trim() || null,
        allowOverlap: this.state.allowOverlap,
      }

      const result = await this.updateActivityUseCase.execute(request)

      if (result.success) {
        const updatedActivity = result.activity
        this.changeState({
          ...this.state,
          name: updatedActivity.name || '',
          color: updatedActivity.color || '',
          allowOverlap: updatedActivity.allowOverlap,
          initialValues: {
            categoryId: updatedActivity.categoryId,
            name: updatedActivity.name || '',
            color: updatedActivity.color || '',
            allowOverlap: updatedActivity.allowOverlap,
          },
          success: true,
          message: 'Actividad actualizada correctamente.',
          isLoading: false,
        })
        return
      }

      // Error del servidor
      const errorResult = result.error
      const rawErrors = errorResult.errors ?? {
        general: [errorResult.title || errorResult.detail],
      }
      const errors = this.normalizeErrorKeys(
        rawErrors as Record<string, string[]>
      )

      this.changeState({
        ...this.state,
        errors,
        success: false,
        message: errorResult.title || 'Error al actualizar la actividad.',
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
    this.changeState(initialActivityEditFormState)
  }

  private validateForm(): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    if (!this.state.name || this.state.name.trim() === '') {
      errors.name = ['El nombre de la actividad es requerido']
    }

    return errors
  }

  private normalizeErrorKeys(
    errors: Record<string, string[]>
  ): Record<string, string[]> {
    const normalized: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(errors)) {
      normalized[key.toLowerCase()] = value
    }
    return normalized
  }
}
