/**
 * APPLICATION LAYER - Caso de Uso para obtener el detalle de un registro de actividad por ID
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']
type GetActivityLogIdPath = ApiActivityLogsTypes['GetActivityLogIdParams']

export class GetActivityLogByIdUseCase implements IUseCase<
  GetActivityLogIdPath,
  ActivityLogResponse | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: GetActivityLogIdPath
  ): Promise<ActivityLogResponse | ProblemDetails> {
    return await this.activityLogService.getActivityLogById(request)
  }
}
