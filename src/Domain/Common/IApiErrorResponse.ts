/**
 * Interfaz estándar para respuestas de error de la API
 * Utilizada por todos los endpoints para manejar errores
 */
export interface ApiErrorResponse {
  type?: string
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}
