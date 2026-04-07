import type { ApiErrorResponse } from '../Common/IApiErrorResponse'

/**
 * Respuesta del endpoint GET /api/v1/categories
 * Representa una categoría del usuario autenticado
 */
export interface CategoryResponse {
  id: string
  userId: string
  name: string | null
  color: string | null
}

/**
 * Respuesta de error de la API para categorías
 * Utiliza la interfaz común ApiErrorResponse
 */
export type CategoryErrorResponse = ApiErrorResponse
