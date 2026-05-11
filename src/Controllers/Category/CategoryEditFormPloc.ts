/**
 * CONTROLLER LAYER - CategoryEditFormPloc
 * PLOC para el formulario de edición de categorías.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ICategoryEditFormState,
  initialCategoryEditFormState,
} from '../../Domain'
import type {
  UpdateCategoryUseCase,
  CategoryResponse,
  ProblemDetails as UpdateCategoryError,
  UpdateCategoryCommand,
} from '../../Application/UseCases/Category/UpdateCategoryUseCase'
import type { GetCategoryByIdUseCase } from '../../Application/UseCases/Category/GetCategoryByIdUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class CategoryEditFormPloc extends Ploc<ICategoryEditFormState> {
  private readonly updateCategoryUseCase: UpdateCategoryUseCase
  private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase

  constructor(
    updateCategoryUseCase: UpdateCategoryUseCase,
    getCategoryByIdUseCase: GetCategoryByIdUseCase
  ) {
    super(initialCategoryEditFormState)
    this.updateCategoryUseCase = updateCategoryUseCase
    this.getCategoryByIdUseCase = getCategoryByIdUseCase
  }

  /**
   * Inicializa el formulario con los datos de la categoría a editar.
   */
  async initializeForm(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      id,
    })

    try {
      const result = await this.getCategoryByIdUseCase.execute({ id })

      if (this.isCategorySuccess(result)) {
        const category = result
        this.changeState({
          ...this.state,
          name: category.name ?? '',
          color: category.color ?? '',
          initialValues: {
            name: category.name ?? '',
            color: category.color ?? '',
          },
          isLoading: false,
          errors: {},
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: mappedErrors,
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

    // Verificar si hay cambios
    const hasChanges =
      this.state.name !== this.state.initialValues.name ||
      this.state.color !== this.state.initialValues.color

    if (!hasChanges) {
      this.changeState({
        ...this.state,
        success: true,
        message: 'No hay cambios para guardar.',
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
      const request: UpdateCategoryCommand = {
        id: this.state.id,
        name: this.state.name.trim() || null,
        color: this.state.color.trim() || null,
      }

      const result = await this.updateCategoryUseCase.execute(request)

      if (this.isCategorySuccess(result)) {
        this.changeState({
          ...this.state,
          name: result.name ?? '',
          color: result.color ?? '',
          initialValues: {
            name: result.name ?? '',
            color: result.color ?? '',
          },
          errors: {},
          success: true,
          message: 'Categoría actualizada correctamente.',
          isLoading: false,
        })
        return
      }

      // Error del servidor
      const mappedErrors = mapProblemDetailsToErrors(result)

      this.changeState({
        ...this.state,
        errors: mappedErrors,
        success: false,
        message: result.title || 'Error al actualizar la categoría.',
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
    this.changeState({
      ...initialCategoryEditFormState,
      name: this.state.initialValues.name,
      color: this.state.initialValues.color,
      initialValues: this.state.initialValues,
    })
  }

  private validateForm(): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    if (!this.state.name || this.state.name.trim() === '') {
      errors.name = ['El nombre de la categoría es requerido']
    }

    return errors
  }

  private isCategorySuccess(
    result: CategoryResponse | UpdateCategoryError
  ): result is CategoryResponse {
    return 'id' in result && 'name' in result
  }
}
