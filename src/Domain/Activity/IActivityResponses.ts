import type { ApiErrorResponse } from '../Common/IApiErrorResponse'

/**
 * DOMAIN LAYER - Activity Response Interfaces
 */

/**
 * Respuesta del endpoint GET /api/v1/activities
 * Representa una actividad del usuario autenticado
 */
export interface ActivityResponse {
  id: string // UUID
  userId: string // UUID
  categoryId: string // UUID
  name: string | null
  color: string | null
  allowOverlap: boolean
}

/**
 * Respuesta del endpoint GET /api/v1/activities/{activityId}/definitions
 * Representa una definición de valor configurable para una actividad
 */
export interface ActivityValueDefinitionResponse {
  id: string // UUID
  activityId: string // UUID
  name: string | null
  valueType: string | null // p.ej. "Number", "Text", "Boolean", "Duration"
  isRequired: boolean
  unit: string | null // p.ej. "kg", "km", "min"
  minValue: string | null
  maxValue: string | null
}

/**
 * Respuesta de error de la API para actividades
 * Utiliza la interfaz común ApiErrorResponse
 */
export type ActivityErrorResponse = ApiErrorResponse
