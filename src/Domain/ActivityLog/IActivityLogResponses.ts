/**
 * DOMAIN LAYER - Interfaces de respuesta de la API para Activity Logs
 */

export interface LogValueResponse {
  id: string
  activityLogId: string
  valueDefinitionId: string
  value: string | null
}

export interface ActivityLogResponse {
  id: string
  activityId: string
  startedAt: string // ISO 8601 string date-time
  endedAt: string | null // ISO 8601 string date-time
  durationMinutes: number | null
  values: LogValueResponse[] | null
}
