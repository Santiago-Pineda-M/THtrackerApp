/**
 * DOMAIN LAYER - Problem Details
 * Estándar RFC 7807 para errores de la API.
 * Tipo genérico para parsear respuestas de error HTTP.
 */

export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  errors?: Record<string, string[]>
}
