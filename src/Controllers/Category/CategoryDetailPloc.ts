/**
 * CONTROLLER LAYER - CategoryDetailPloc
 * PLOC para mostrar una categoría específica por su ID.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ICategoryDetailState,
  initialCategoryDetailState,
} from '../../Domain'
import type {
  GetCategoryByIdUseCase,
  CategoryResponse,
  ProblemDetails,
} from '../../Application/UseCases/Category/GetCategoryByIdUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class CategoryDetailPloc extends Ploc<ICategoryDetailState> {
  private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase

  constructor(getCategoryByIdUseCase: GetCategoryByIdUseCase) {
    super(initialCategoryDetailState)
    this.getCategoryByIdUseCase = getCategoryByIdUseCase
  }

  /**
   * Carga una categoría específica por su ID.
   */
  async loadCategory(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getCategoryByIdUseCase.execute({ id })

      if (this.isCategorySuccess(result)) {
        this.changeState({
          ...this.state,
          category: result,
          isLoading: false,
          errors: {},
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        category: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar la categoría'
      this.changeState({
        ...this.state,
        category: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  private isCategorySuccess(
    result: CategoryResponse | ProblemDetails
  ): result is CategoryResponse {
    return 'id' in result && 'name' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialCategoryDetailState)
  }
}
