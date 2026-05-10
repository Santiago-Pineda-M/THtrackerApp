/**
 * APPLICATION LAYER - Caso de Uso para obtener logs de una actividad
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
type ActivityLogResponsePaginated =
  ApiActivityLogsTypes['ActivityLogResponsePaginated']
type GetActivityLogsRequest = ApiActivityLogsTypes['GetActivityLogsParams']

export class GetActivityLogsUseCase implements IUseCase<
  GetActivityLogsRequest,
  ActivityLogResponsePaginated | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: GetActivityLogsRequest
  ): Promise<ActivityLogResponsePaginated | ProblemDetails> {
    return await this.activityLogService.getActivityLogs(request)
  }
}
