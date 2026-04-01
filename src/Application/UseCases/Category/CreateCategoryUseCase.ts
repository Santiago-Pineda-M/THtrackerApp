/**
 * APPLICATION LAYER - CreateCategoryUseCase
 * Caso de uso para crear una nueva categoría.
 */

import type { IUseCase } from '../../../Domain';
import type { ICategoryService } from '../../Services/Category/ICategoryService';
import type { CreateCategoryRequest, CategoryResponse, ApiErrorResponse } from '../../../Domain';

/**
 * Input del caso de uso
 */
export interface CreateCategoryInput {
    name: string | null;
    color: string | null;
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type CreateCategoryOutput = 
    | { success: true; category: CategoryResponse }
    | { success: false; error: ApiErrorResponse };

/**
 * Caso de uso para crear una nueva categoría.
 * POST /api/v1/categories
 */
export class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
    private readonly categoryService: ICategoryService;

    constructor(categoryService: ICategoryService) {
        this.categoryService = categoryService;
    }

    async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
        const request: CreateCategoryRequest = {
            name: input.name,
            color: input.color,
        };

        const result = await this.categoryService.createCategory(request);

        if (this.isError(result)) {
            return { success: false, error: result };
        }

        return { success: true, category: result };
    }

    private isError(result: CategoryResponse | ApiErrorResponse): result is ApiErrorResponse {
        return 'title' in result || 'detail' in result || 'status' in result;
    }
}
