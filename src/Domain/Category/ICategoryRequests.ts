/**
 * Request para el endpoint POST /api/v1/categories
 * Solicitud para crear una nueva categoría
 */
export interface CreateCategoryRequest {
  name: string | null;
  color: string | null;
}

/**
 * Request para el endpoint PUT /api/v1/categories/{id}
 * Solicitud para actualizar una categoría existente
 */
export interface UpdateCategoryRequest {
  name: string | null;
  color: string | null;
}
