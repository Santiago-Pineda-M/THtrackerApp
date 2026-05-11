/**
 * APPLICATION LAYER - Caso de Uso para obtener logs filtrados por fecha
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
export type ActivityLogPaginatedResponse =
  ApiActivityLogsTypes['ActivityLogResponsePaginated']
export type GetActivityLogsRequest =
  ApiActivityLogsTypes['GetActivityLogsParams']

export class GetCalendarLogsUseCase implements IUseCase<
  GetActivityLogsRequest,
  ActivityLogPaginatedResponse | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService

  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: GetActivityLogsRequest
  ): Promise<ActivityLogPaginatedResponse | ProblemDetails> {
    return await this.activityLogService.getActivityLogs(request)
  }
}
