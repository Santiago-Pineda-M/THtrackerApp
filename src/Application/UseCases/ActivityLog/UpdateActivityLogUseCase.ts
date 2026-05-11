/**
 * APPLICATION LAYER - Caso de Uso para actualizar los metadatos de un log (fechas)
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
export type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']
export type UpdateActivityLogCommand =
  ApiActivityLogsTypes['UpdateActivityLogCommand']

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
