/**
 * APPLICATION LAYER - UpdateCategoryUseCase
 * Caso de uso para actualizar una categoría existente.
 */

import type { IUseCase, ApiCategoriesTypes } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'

export type CategoryResponse = ApiCategoriesTypes['CategoryResponse']
export type ProblemDetails = ApiCategoriesTypes['ProblemDetails']
export type UpdateCategoryCommand = ApiCategoriesTypes['UpdateCategoryCommand']

export type UpdateCategoryIdPath = ApiCategoriesTypes['UpdateCategoryIdPath']

/**
 * Caso de uso para actualizar una categoría existente.
 * PUT /api/v1/categories/{id}
 */
export class UpdateCategoryUseCase implements IUseCase<
  UpdateCategoryCommand,
  CategoryResponse | ProblemDetails
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(
    request: UpdateCategoryCommand
  ): Promise<CategoryResponse | ProblemDetails> {
    const params: UpdateCategoryIdPath = {
      id: request.id!,
    }
    return await this.categoryService.updateCategory(params, request)
  }
}
