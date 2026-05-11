/**
 * APPLICATION LAYER - Interfaz del servicio para Activity Logs
 */

import type { ApiActivityLogsTypes } from '../../../Domain'
type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']
type ActivityLogResponsePaginated =
  ApiActivityLogsTypes['ActivityLogResponsePaginated']
type StartActivityCommand = ApiActivityLogsTypes['StartActivityCommand']
type UpdateActivityLogCommand = ApiActivityLogsTypes['UpdateActivityLogCommand']
type SaveLogValuesCommand = ApiActivityLogsTypes['SaveLogValuesCommand']
type LogValueResponsePaginated =
  ApiActivityLogsTypes['LogValueResponsePaginated']
type GetActivityLogsParams = ApiActivityLogsTypes['GetActivityLogsParams']
type GetActivityLogIdParams = ApiActivityLogsTypes['GetActivityLogIdParams']
type UpdateActivityLogParams = ApiActivityLogsTypes['UpdateActivityLogParams']
type StopActivityLogParams = ApiActivityLogsTypes['StopActivityLogParams']
type SaveActivityLogValuesParams =
  ApiActivityLogsTypes['SaveActivityLogValuesParams']
type GetActivityLogValuesParams =
  ApiActivityLogsTypes['GetActivityLogValuesParams']
type GetActiveActivityLogsFilters =
  ApiActivityLogsTypes['GetActiveActivityLogsFilters']

export interface IActivityLogService {
  getActivityLogs(
    filters?: GetActivityLogsParams
  ): Promise<ActivityLogResponsePaginated | ProblemDetails>
  getActivityLogById(
    id: GetActivityLogIdParams
  ): Promise<ActivityLogResponse | ProblemDetails>
  startActivityLog(
    request: StartActivityCommand
  ): Promise<ActivityLogResponse | ProblemDetails>
  stopActivityLog(
    id: StopActivityLogParams
  ): Promise<ActivityLogResponse | ProblemDetails>
  updateActivityLog(
    id: UpdateActivityLogParams,
    request: UpdateActivityLogCommand
  ): Promise<ActivityLogResponse | ProblemDetails>
  saveActivityLogValues(
    id: SaveActivityLogValuesParams,
    request: SaveLogValuesCommand
  ): Promise<void | ProblemDetails>
  getActivityLogValues(
    id: GetActivityLogValuesParams
  ): Promise<LogValueResponsePaginated | ProblemDetails>
  getActiveActivityLogs(
    filters: GetActiveActivityLogsFilters
  ): Promise<ActivityLogResponsePaginated | ProblemDetails>
}
