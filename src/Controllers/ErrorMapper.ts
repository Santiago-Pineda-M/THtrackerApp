import type { CommonTypes } from '../Domain/api'

type ProblemDetails = CommonTypes['ProblemDetails']

/**
 * Mapea un objeto ProblemDetails (proveniente de la API) a un diccionario clave-valor
 * de errores para su uso en el estado del controlador.
 *
 * @param problemDetails - El objeto de error de la API
 * @returns Un diccionario donde las claves son nombres de campos y los valores son arrays de mensajes de error
 */
export function mapProblemDetailsToErrors(
  problemDetails: ProblemDetails
): Record<string, string[]> {
  const errors: Record<string, string[]> = {}

  if (problemDetails.errors && typeof problemDetails.errors === 'object') {
    const problemErrors = problemDetails.errors as Record<string, string[]>
    Object.keys(problemErrors).forEach((key) => {
      const messages = problemErrors[key]
      if (Array.isArray(messages) && messages.length > 0) {
        errors[key] = messages
      }
    })
  }

  if (Object.keys(errors).length === 0) {
    const generalError = problemDetails.detail || problemDetails.title
    if (generalError) {
      errors.general = [generalError]
    }
  }

  return errors
}
