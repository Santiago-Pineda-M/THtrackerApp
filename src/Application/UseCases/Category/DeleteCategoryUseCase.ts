/**
 * APPLICATION LAYER - DeleteCategoryUseCase
 * Caso de uso para eliminar una categoría existente.
 */

import type { IUseCase } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'
import type { ApiCategoriesTypes } from '../../../Domain'

export type DeleteCategoryRequest = ApiCategoriesTypes['DeleteCategoryIdPath']
export type ProblemDetails = ApiCategoriesTypes['ProblemDetails']

/**
 * Caso de uso para eliminar una categoría existente.
 * DELETE /api/v1/categories/{id}
 */
export class DeleteCategoryUseCase implements IUseCase<
  DeleteCategoryRequest,
  void | ProblemDetails
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(input: DeleteCategoryRequest): Promise<void | ProblemDetails> {
    return await this.categoryService.deleteCategory(input)
  }
}
