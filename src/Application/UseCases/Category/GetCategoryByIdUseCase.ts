/**
 * APPLICATION LAYER - GetCategoryByIdUseCase
 * Caso de uso para obtener una categoría específica por su ID.
 */

import type { IUseCase, ApiCategoriesTypes } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'

type CategoryResponse = ApiCategoriesTypes['CategoryResponse']
type ProblemDetails = ApiCategoriesTypes['ProblemDetails']
type GetCategoryByIdInput = ApiCategoriesTypes['GetCategoryIdPath']

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type GetCategoryByIdOutput = CategoryResponse | ProblemDetails

/**
 * Caso de uso para obtener una categoría específica por su ID.
 * GET /api/v1/categories/{id}
 */
export class GetCategoryByIdUseCase implements IUseCase<
  GetCategoryByIdInput,
  GetCategoryByIdOutput
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(input: GetCategoryByIdInput): Promise<GetCategoryByIdOutput> {
    const result = await this.categoryService.getCategoryById(input)

    return result
  }
}
