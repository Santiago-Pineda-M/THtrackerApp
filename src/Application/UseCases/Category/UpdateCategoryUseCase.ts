/**
 * APPLICATION LAYER - UpdateCategoryUseCase
 * Caso de uso para actualizar una categoría existente.
 */

import type { IUseCase, ApiCategoriesTypes } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'

type CategoryResponse = ApiCategoriesTypes['CategoryResponse']
type ProblemDetails = ApiCategoriesTypes['ProblemDetails']
type UpdateCategoryRequest = ApiCategoriesTypes['UpdateCategoryCommand']

type UpdateCategoryParams = ApiCategoriesTypes['UpdateCategoryIdPath']

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type UpdateCategoryOutput = CategoryResponse | ProblemDetails
/**
 * Caso de uso para actualizar una categoría existente.
 * PUT /api/v1/categories/{id}
 */
export class UpdateCategoryUseCase implements IUseCase<
  UpdateCategoryRequest,
  UpdateCategoryOutput
> {
  private readonly categoryService: ICategoryService

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService
  }

  async execute(request: UpdateCategoryRequest): Promise<UpdateCategoryOutput> {
    const params: UpdateCategoryParams = {
      id: request.id!,
    }
    return await this.categoryService.updateCategory(params, request)
  }
}
