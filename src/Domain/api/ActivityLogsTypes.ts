import type { components, paths } from './api'

type ProblemDetails = components['schemas']['ProblemDetails']

type ActivityLogResponse = components['schemas']['ActivityLogResponse']
type ActivityLogResponsePaginated =
  components['schemas']['ActivityLogResponsePaginatedResponse']
type StartActivityCommand = components['schemas']['StartActivityCommand']
type UpdateActivityLogCommand =
  components['schemas']['UpdateActivityLogCommand']
type SaveLogValuesCommand = components['schemas']['SaveLogValuesCommand']
type LogValueResponsePaginated =
  components['schemas']['LogValueResponsePaginatedResponse']

type GetActivityLogsParams =
  paths['/api/v1/activity-logs']['get']['parameters']['query']
type GetActivityLogIdParams =
  paths['/api/v1/activity-logs/{id}']['get']['parameters']['path']
type UpdateActivityLogParams =
  paths['/api/v1/activity-logs/{id}']['put']['parameters']['path']
type StopActivityLogParams =
  paths['/api/v1/activity-logs/{id}/stop']['post']['parameters']['path']
type SaveActivityLogValuesParams =
  paths['/api/v1/activity-logs/{id}/values']['post']['parameters']['path']
type GetActivityLogValuesParams =
  paths['/api/v1/activity-logs/{id}/values']['get']['parameters']['path']
type GetActiveActivityLogsFilters =
  paths['/api/v1/activity-logs/active']['get']['parameters']['query']

type ApiActivityLogsTypes = {
  ProblemDetails: ProblemDetails
  ActivityLogResponse: ActivityLogResponse
  ActivityLogResponsePaginated: ActivityLogResponsePaginated
  StartActivityCommand: StartActivityCommand
  UpdateActivityLogCommand: UpdateActivityLogCommand
  SaveLogValuesCommand: SaveLogValuesCommand
  LogValueResponsePaginated: LogValueResponsePaginated
  GetActivityLogsParams: GetActivityLogsParams
  GetActivityLogIdParams: GetActivityLogIdParams
  UpdateActivityLogParams: UpdateActivityLogParams
  StopActivityLogParams: StopActivityLogParams
  SaveActivityLogValuesParams: SaveActivityLogValuesParams
  GetActivityLogValuesParams: GetActivityLogValuesParams
  GetActiveActivityLogsFilters: GetActiveActivityLogsFilters
}

export { type ApiActivityLogsTypes }
