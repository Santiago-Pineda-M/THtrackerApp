/**
 * APPLICATION LAYER - GetCategoriesUseCase
 * Caso de uso para obtener todas las categorías del usuario autenticado.
 */

import type { IUseCase } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'
import type { CategoryResponse, ApiErrorResponse } from '../../../Domain'

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type GetCategoriesOutput =
  | { success: true; categories: CategoryResponse[] }
  | { success: false; error: ApiErrorResponse }

/**
 * Caso de uso para obtener todas las categorías del usuario autenticado.
 * GET /api/v1/categories
 */
export class GetCategoriesUseCase implements IUseCase<
  void,
  GetCategoriesOutput
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(): Promise<GetCategoriesOutput> {
    const result = await this.categoryService.getCategories()

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, categories: result }
  }

  private isError(
    result: CategoryResponse[] | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
