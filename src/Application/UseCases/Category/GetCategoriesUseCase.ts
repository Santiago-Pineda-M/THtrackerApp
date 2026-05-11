/**
 * APPLICATION LAYER - GetCategoriesUseCase
 * Caso de uso para obtener todas las categorías del usuario autenticado.
 */

import type { IUseCase, ApiCategoriesTypes } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'

export type ProblemDetails = ApiCategoriesTypes['ProblemDetails']
export type CategoryResponsePaginatedResponse =
  ApiCategoriesTypes['CategoryPaginatedResponse']
export type GetCategoriesRequest = ApiCategoriesTypes['GetCategoriesFilters']

/**
 * Caso de uso para obtener todas las categorías del usuario autenticado.
 * GET /api/v1/categories
 */
export class GetCategoriesUseCase implements IUseCase<
  GetCategoriesRequest,
  CategoryResponsePaginatedResponse | ProblemDetails
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(
    filters?: GetCategoriesRequest
  ): Promise<CategoryResponsePaginatedResponse | ProblemDetails> {
    return await this.categoryService.getCategories(filters)
  }
}
