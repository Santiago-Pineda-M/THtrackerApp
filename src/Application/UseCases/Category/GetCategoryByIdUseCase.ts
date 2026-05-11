/**
 * APPLICATION LAYER - GetCategoryByIdUseCase
 * Caso de uso para obtener una categoría específica por su ID.
 */

import type { IUseCase, ApiCategoriesTypes } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'

export type CategoryResponse = ApiCategoriesTypes['CategoryResponse']
export type ProblemDetails = ApiCategoriesTypes['ProblemDetails']
export type GetCategoryByIdInput = ApiCategoriesTypes['GetCategoryIdPath']

/**
 * Caso de uso para obtener una categoría específica por su ID.
 * GET /api/v1/categories/{id}
 */
export class GetCategoryByIdUseCase implements IUseCase<
  GetCategoryByIdInput,
  CategoryResponse | ProblemDetails
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(
    input: GetCategoryByIdInput
  ): Promise<CategoryResponse | ProblemDetails> {
    return await this.categoryService.getCategoryById(input)
  }
}
