/**
 * APPLICATION LAYER - Category Service Interface
 * Puerto para el servicio de gestión de categorías.
 * Refleja los endpoints de /api/v1/categories
 */

import type {
    CategoryResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    ApiErrorResponse,
} from '../../../Domain';

/**
 * Contrato del servicio de categorías.
 * Implementado en Infrastructure por CategoryService.
 */
export interface ICategoryService {
    /**
     * Obtiene todas las categorías del usuario autenticado.
     * GET /api/v1/categories
     * @returns Array de CategoryResponse o ApiErrorResponse en caso de error
     */
    getCategories(): Promise<CategoryResponse[] | ApiErrorResponse>;

    /**
     * Obtiene una categoría específica por su ID.
     * GET /api/v1/categories/{id}
     * @param id - ID de la categoría (UUID)
     * @returns CategoryResponse o ApiErrorResponse en caso de error
     */
    getCategoryById(id: string): Promise<CategoryResponse | ApiErrorResponse>;

    /**
     * Crea una nueva categoría para el usuario autenticado.
     * POST /api/v1/categories
     * @param request - Datos de la categoría a crear (name)
     * @returns CategoryResponse creada o ApiErrorResponse en caso de error
     */
    createCategory(request: CreateCategoryRequest): Promise<CategoryResponse | ApiErrorResponse>;

    /**
     * Actualiza una categoría existente.
     * PUT /api/v1/categories/{id}
     * @param id - ID de la categoría a actualizar (UUID)
     * @param request - Datos a actualizar (name)
     * @returns CategoryResponse actualizada o ApiErrorResponse en caso de error
     */
    updateCategory(id: string, request: UpdateCategoryRequest): Promise<CategoryResponse | ApiErrorResponse>;

    /**
     * Elimina una categoría existente.
     * DELETE /api/v1/categories/{id}
     * @param id - ID de la categoría a eliminar (UUID)
     * @returns void o ApiErrorResponse en caso de error
     */
    deleteCategory(id: string): Promise<void | ApiErrorResponse>;
}
