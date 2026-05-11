/**
 * CONTROLLER LAYER - CategoryDeletePloc
 * PLOC para eliminar una categoría.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ICategoryDeleteState,
  initialCategoryDeleteState,
} from '../../Domain'
import type {
  DeleteCategoryUseCase,
  ProblemDetails,
} from '../../Application/UseCases/Category/DeleteCategoryUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class CategoryDeletePloc extends Ploc<ICategoryDeleteState> {
  private readonly deleteCategoryUseCase: DeleteCategoryUseCase

  constructor(deleteCategoryUseCase: DeleteCategoryUseCase) {
    super(initialCategoryDeleteState)
    this.deleteCategoryUseCase = deleteCategoryUseCase
  }

  /**
   * Elimina una categoría por su ID.
   */
  async deleteCategory(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.deleteCategoryUseCase.execute({ id })

      if (this.isCategoryDeleteError(result)) {
        const mappedErrors = mapProblemDetailsToErrors(result)
        this.changeState({
          ...this.state,
          isLoading: false,
          success: false,
          errors: mappedErrors,
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        success: true,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al eliminar la categoría'
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        errors: { general: [message] },
      })
    }
  }

  /**
   * Type guard para verificar si el resultado es un error.
   */
  private isCategoryDeleteError(
    result: void | ProblemDetails
  ): result is ProblemDetails {
    return typeof result === 'object' && result !== null && 'type' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialCategoryDeleteState)
  }
}
