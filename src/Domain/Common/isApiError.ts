import type { ApiErrorResponse } from './IApiErrorResponse'

/**
 * Type guard reutilizable para discriminar si una respuesta del servicio
 * es un ApiErrorResponse. Evita duplicar la misma lógica en cada UseCase.
 *
 * Un ApiErrorResponse tiene al menos uno de: title, detail o status.
 */
export function isApiError(result: unknown): result is ApiErrorResponse {
  if (typeof result !== 'object' || result === null) return false
  return 'title' in result || 'detail' in result || 'status' in result
}
