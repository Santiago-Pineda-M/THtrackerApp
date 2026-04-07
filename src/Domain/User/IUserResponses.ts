/**
 * Respuesta del endpoint GET /api/v1/users/me
 * Representa los datos del usuario autenticado
 */
export interface UserProfileResponse {
  id: string
  name: string | null
  email: string | null
}

/**
 * Problema detalles para errores
 */
export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}
