/**
 * APPLICATION LAYER - GetCategoryByIdUseCase
 * Caso de uso para obtener una categoría específica por su ID.
 */

import type { IUseCase } from '../../../Domain'
import type { ICategoryService } from '../../Services/Category/ICategoryService'
import type { CategoryResponse, ApiErrorResponse } from '../../../Domain'

/**
 * Input del caso de uso
 */
export interface GetCategoryByIdInput {
  id: string
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type GetCategoryByIdOutput =
  | { success: true; category: CategoryResponse }
  | { success: false; error: ApiErrorResponse }

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
    const result = await this.categoryService.getCategoryById(input.id)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, category: result }
  }

  private isError(
    result: CategoryResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
