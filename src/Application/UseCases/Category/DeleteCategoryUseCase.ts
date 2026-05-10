/**
 * APPLICATION LAYER - DeleteCategoryUseCase
 * Caso de uso para eliminar una categoría existente.
 */

import type { IUseCase } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'
import type { ApiCategoriesTypes } from '../../../Domain'

type DeleteCategoryRequest = ApiCategoriesTypes['DeleteCategoryIdPath']
type ProblemDetails = ApiCategoriesTypes['ProblemDetails']

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type DeleteCategoryOutput = void | ProblemDetails

/**
 * Caso de uso para eliminar una categoría existente.
 * DELETE /api/v1/categories/{id}
 */
export class DeleteCategoryUseCase implements IUseCase<
  DeleteCategoryRequest,
  DeleteCategoryOutput
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(input: DeleteCategoryRequest): Promise<DeleteCategoryOutput> {
    return await this.categoryService.deleteCategory(input)
  }
}
