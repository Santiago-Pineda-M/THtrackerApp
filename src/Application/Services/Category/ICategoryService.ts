/**
 * APPLICATION LAYER - Category Service Interface
 * Puerto para el servicio de gestión de categorías.
 * Refleja los endpoints de /api/v1/categories
 */

import type { ApiCategoriesTypes } from '../../../Domain'

type CategoryResponse = ApiCategoriesTypes['CategoryResponse']
type CategoryPaginatedResponse = ApiCategoriesTypes['CategoryPaginatedResponse']
type UpdateCategoryRequest = ApiCategoriesTypes['UpdateCategoryCommand']
type CreateCategoryRequest = ApiCategoriesTypes['CreateCategoryCommand']
type ProblemDetails = ApiCategoriesTypes['ProblemDetails']

type GetCategoriesFilters = ApiCategoriesTypes['GetCategoriesFilters']
type GetCategoryIdPath = ApiCategoriesTypes['GetCategoryIdPath']
type DeleteCategoryIdPath = ApiCategoriesTypes['DeleteCategoryIdPath']
type UpdateCategoryIdPath = ApiCategoriesTypes['UpdateCategoryIdPath']

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
  getCategories(
    filters?: GetCategoriesFilters
  ): Promise<CategoryPaginatedResponse | ProblemDetails>

  /**
   * Obtiene una categoría específica por su ID.
   * GET /api/v1/categories/{id}
   * @param id - ID de la categoría (UUID)
   * @returns CategoryResponse o ApiErrorResponse en caso de error
   */
  getCategoryById(
    id: GetCategoryIdPath
  ): Promise<CategoryResponse | ProblemDetails>

  /**
   * Crea una nueva categoría para el usuario autenticado.
   * POST /api/v1/categories
   * @param request - Datos de la categoría a crear (name)
   * @returns CategoryResponse creada o ApiErrorResponse en caso de error
   */
  createCategory(
    request: CreateCategoryRequest
  ): Promise<CategoryResponse | ProblemDetails>

  /**
   * Actualiza una categoría existente.
   * PUT /api/v1/categories/{id}
   * @param id - ID de la categoría a actualizar (UUID)
   * @param request - Datos a actualizar (name)
   * @returns CategoryResponse actualizada o ApiErrorResponse en caso de error
   */
  updateCategory(
    id: UpdateCategoryIdPath,
    request: UpdateCategoryRequest
  ): Promise<CategoryResponse | ProblemDetails>

  /**
   * Elimina una categoría existente.
   * DELETE /api/v1/categories/{id}
   * @param id - ID de la categoría a eliminar (UUID)
   * @returns void o ApiErrorResponse en caso de error
   */
  deleteCategory(id: DeleteCategoryIdPath): Promise<void | ProblemDetails>
}
