/**
 * APPLICATION LAYER - Caso de Uso para detener un registro de actividad
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
export type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']
export type StopActivityLogRequest =
  ApiActivityLogsTypes['GetActivityLogValuesParams']

export class StopActivityLogUseCase implements IUseCase<
  StopActivityLogRequest,
  ActivityLogResponse | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: StopActivityLogRequest
  ): Promise<ActivityLogResponse | ProblemDetails> {
    return await this.activityLogService.stopActivityLog(request)
  }
}
