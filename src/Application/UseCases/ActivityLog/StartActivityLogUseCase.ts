/**
 * APPLICATION LAYER - Caso de Uso para iniciar un registro de actividad
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
export type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']
export type StartActivityCommand = ApiActivityLogsTypes['StartActivityCommand']

export class StartActivityLogUseCase implements IUseCase<
  StartActivityCommand,
  ActivityLogResponse | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: StartActivityCommand
  ): Promise<ActivityLogResponse | ProblemDetails> {
    return await this.activityLogService.startActivityLog(request)
  }
}
