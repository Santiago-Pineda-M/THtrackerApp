/**
 * CONTROLLER LAYER - CategoriesListPloc
 * PLOC para mostrar la lista de categorías del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ICategoriesListState,
  initialCategoriesListState,
} from '../../Domain'
import { mapProblemDetailsToErrors } from '../ErrorMapper'
import type {
  GetCategoriesUseCase,
  CategoryResponsePaginatedResponse,
  ProblemDetails,
} from '../../Application/UseCases/Category/GetCategoriesUseCase'

export class CategoriesListPloc extends Ploc<ICategoriesListState> {
  private readonly getCategoriesUseCase: GetCategoriesUseCase

  constructor(getCategoriesUseCase: GetCategoriesUseCase) {
    super(initialCategoriesListState)
    this.getCategoriesUseCase = getCategoriesUseCase
  }

  /**
   * Carga todas las categorías del usuario autenticado.
   */
  async loadCategories(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getCategoriesUseCase.execute()

      if (this.isCategoriesSuccess(result)) {
        this.changeState({
          ...this.state,
          categories: result,
          isLoading: false,
          errors: {},
        })
        return
      }

      const errorResult = result as ProblemDetails
      const mappedErrors = mapProblemDetailsToErrors(errorResult)
      this.changeState({
        ...this.state,
        categories: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar las categorías'
      this.changeState({
        ...this.state,
        categories: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  /**
   * Type guard para verificar si el resultado es una respuesta exitosa de categorías.
   */
  private isCategoriesSuccess(
    result: CategoryResponsePaginatedResponse | ProblemDetails
  ): result is CategoryResponsePaginatedResponse {
    return 'items' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialCategoriesListState)
  }
}
