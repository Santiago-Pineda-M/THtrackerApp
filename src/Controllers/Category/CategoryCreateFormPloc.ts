/**
 * CONTROLLER LAYER - CategoryCreateFormPloc
 * PLOC para el formulario de creación de categorías.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ICategoryCreateFormState,
  initialCategoryCreateFormState,
} from '../../Domain'
import type { CreateCategoryUseCase } from '../../Application/UseCases/Category'

export class CategoryCreateFormPloc extends Ploc<ICategoryCreateFormState> {
  private readonly createCategoryUseCase: CreateCategoryUseCase

  constructor(createCategoryUseCase: CreateCategoryUseCase) {
    super(initialCategoryCreateFormState)
    this.createCategoryUseCase = createCategoryUseCase
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
        name: this.state.name.trim() || null,
        color: this.state.color.trim() || null,
      }

      const result = await this.createCategoryUseCase.execute(request)

      if (result.success) {
        this.changeState({
          ...initialCategoryCreateFormState,
          success: true,
          message: 'Categoría creada correctamente.',
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
        message: errorResult.title || 'Error al crear la categoría.',
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
    this.changeState(initialCategoryCreateFormState)
  }

  private validateForm(): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    if (!this.state.name || this.state.name.trim() === '') {
      errors.name = ['El nombre de la categoría es requerido']
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
