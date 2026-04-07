/**
 * APPLICATION LAYER - Interfaz del servicio para Activity Logs
 */

import type {
  ActivityLogResponse,
  StartActivityLogRequest,
  UpdateActivityLogRequest,
  LogValueRequest,
  LogValueResponse,
  ApiErrorResponse,
} from '../../../Domain'

export interface IActivityLogService {
  getActivityLogs(
    activityId: string
  ): Promise<ActivityLogResponse[] | ApiErrorResponse>
  getActivityLogById(
    id: string
  ): Promise<ActivityLogResponse | ApiErrorResponse>
  startActivityLog(
    request: StartActivityLogRequest
  ): Promise<ActivityLogResponse | ApiErrorResponse>
  stopActivityLog(id: string): Promise<ActivityLogResponse | ApiErrorResponse>
  updateActivityLog(
    id: string,
    request: UpdateActivityLogRequest
  ): Promise<ActivityLogResponse | ApiErrorResponse>
  saveActivityLogValues(
    id: string,
    request: LogValueRequest[]
  ): Promise<void | ApiErrorResponse>
  getActivityLogValues(
    id: string
  ): Promise<LogValueResponse[] | ApiErrorResponse>
}
