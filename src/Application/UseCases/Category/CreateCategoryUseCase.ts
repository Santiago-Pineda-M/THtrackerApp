/**
 * APPLICATION LAYER - CreateCategoryUseCase
 * Caso de uso para crear una nueva categoría.
 */

import type { IUseCase } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'
import type { ApiCategoriesTypes } from '../../../Domain'

export type CreateCategoryCommand = ApiCategoriesTypes['CreateCategoryCommand']
export type CategoryResponse = ApiCategoriesTypes['CategoryResponse']
export type ProblemDetails = ApiCategoriesTypes['ProblemDetails']

/**
 * Caso de uso para crear una nueva categoría.
 * POST /api/v1/categories
 */
export class CreateCategoryUseCase implements IUseCase<
  CreateCategoryCommand,
  CategoryResponse | ProblemDetails
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(
    input: CreateCategoryCommand
  ): Promise<CategoryResponse | ProblemDetails> {
    const request: CreateCategoryCommand = {
      name: input.name,
      color: input.color,
    }

    return await this.categoryService.createCategory(request)
  }
}
