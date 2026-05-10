/**
 * APPLICATION LAYER - CreateCategoryUseCase
 * Caso de uso para crear una nueva categoría.
 */

import type { IUseCase } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'
import type { ApiCategoriesTypes } from '../../../Domain'

type CreateCategoryCommand = ApiCategoriesTypes['CreateCategoryCommand']
type CategoryResponse = ApiCategoriesTypes['CategoryResponse']
type ProblemDetails = ApiCategoriesTypes['ProblemDetails']

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type CreateCategoryOutput = CategoryResponse | ProblemDetails
/**
 * Caso de uso para crear una nueva categoría.
 * POST /api/v1/categories
 */
export class CreateCategoryUseCase implements IUseCase<
  CreateCategoryCommand,
  CreateCategoryOutput
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(input: CreateCategoryCommand): Promise<CreateCategoryOutput> {
    const request: CreateCategoryCommand = {
      name: input.name,
      color: input.color,
    }

    return await this.categoryService.createCategory(request)
  }
}
