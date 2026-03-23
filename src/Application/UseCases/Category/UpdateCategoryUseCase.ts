/**
 * APPLICATION LAYER - UpdateCategoryUseCase
 * Caso de uso para actualizar una categoría existente.
 */

import type { IUseCase } from '../../../Domain';
import type { ICategoryService } from '../../Services/Category/ICategoryService';
import type { UpdateCategoryRequest, CategoryResponse, ApiErrorResponse } from '../../../Domain';

/**
 * Input del caso de uso
 */
export interface UpdateCategoryInput {
    id: string;
    name: string | null;
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type UpdateCategoryOutput = 
    | { success: true; category: CategoryResponse }
    | { success: false; error: ApiErrorResponse };

/**
 * Caso de uso para actualizar una categoría existente.
 * PUT /api/v1/categories/{id}
 */
export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
    private readonly categoryService: ICategoryService;

    constructor(categoryService: ICategoryService) {
        this.categoryService = categoryService;
    }

    async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
        const request: UpdateCategoryRequest = {
            name: input.name,
        };

        const result = await this.categoryService.updateCategory(input.id, request);

        if (this.isError(result)) {
            return { success: false, error: result };
        }

        return { success: true, category: result };
    }

    private isError(result: CategoryResponse | ApiErrorResponse): result is ApiErrorResponse {
        return 'title' in result || 'detail' in result || 'status' in result;
    }
}
