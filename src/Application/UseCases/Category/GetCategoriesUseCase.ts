/**
 * APPLICATION LAYER - GetCategoriesUseCase
 * Caso de uso para obtener todas las categorías del usuario autenticado.
 */

import type { IUseCase, ApiCategoriesTypes } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'

type ProblemDetails = ApiCategoriesTypes['ProblemDetails']
type CategoryResponsePaginatedResponse =
  ApiCategoriesTypes['CategoryPaginatedResponse']
type GetCategoriesRequest = ApiCategoriesTypes['GetCategoriesFilters']

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type GetCategoriesOutput =
  | CategoryResponsePaginatedResponse
  | ProblemDetails

/**
 * Caso de uso para obtener todas las categorías del usuario autenticado.
 * GET /api/v1/categories
 */
export class GetCategoriesUseCase implements IUseCase<
  GetCategoriesRequest,
  GetCategoriesOutput
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(filters?: GetCategoriesRequest): Promise<GetCategoriesOutput> {
    return await this.categoryService.getCategories(filters)
  }
}
