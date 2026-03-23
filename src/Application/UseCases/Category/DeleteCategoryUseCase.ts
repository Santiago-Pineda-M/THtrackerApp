/**
 * APPLICATION LAYER - DeleteCategoryUseCase
 * Caso de uso para eliminar una categoría existente.
 */

import type { IUseCase } from '../../../Domain';
import type { ICategoryService } from '../../Services/Category/ICategoryService';
import type { ApiErrorResponse } from '../../../Domain';

/**
 * Input del caso de uso
 */
export interface DeleteCategoryInput {
    id: string;
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type DeleteCategoryOutput = 
    | { success: true }
    | { success: false; error: ApiErrorResponse };

/**
 * Caso de uso para eliminar una categoría existente.
 * DELETE /api/v1/categories/{id}
 */
export class DeleteCategoryUseCase implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput> {
    private readonly categoryService: ICategoryService;

    constructor(categoryService: ICategoryService) {
        this.categoryService = categoryService;
    }

    async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
        const result = await this.categoryService.deleteCategory(input.id);

        if (this.isError(result)) {
            return { success: false, error: result };
        }

        return { success: true };
    }

    private isError(result: void | ApiErrorResponse): result is ApiErrorResponse {
        return result !== undefined && ('title' in result || 'detail' in result || 'status' in result);
    }
}
