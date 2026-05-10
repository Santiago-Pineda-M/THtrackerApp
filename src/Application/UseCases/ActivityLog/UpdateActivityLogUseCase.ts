/**
 * APPLICATION LAYER - Caso de Uso para actualizar los metadatos de un log (fechas)
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']
type UpdateActivityLogCommand = ApiActivityLogsTypes['UpdateActivityLogCommand']

export class UpdateActivityLogUseCase implements IUseCase<
  UpdateActivityLogCommand,
  ActivityLogResponse | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: UpdateActivityLogCommand
  ): Promise<ActivityLogResponse | ProblemDetails> {
    return await this.activityLogService.updateActivityLog(
      { id: request.id || '' },
      request
    )
  }
}
