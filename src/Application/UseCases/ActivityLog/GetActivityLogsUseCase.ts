/**
 * APPLICATION LAYER - Caso de Uso para obtener logs de una actividad
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
export type ActivityLogResponsePaginated =
  ApiActivityLogsTypes['ActivityLogResponsePaginated']
export type GetActivityLogsRequest =
  ApiActivityLogsTypes['GetActivityLogsParams']

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
