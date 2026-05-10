/**
 * APPLICATION LAYER - Caso de Uso para iniciar un registro de actividad
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']
type StartActivityCommand = ApiActivityLogsTypes['StartActivityCommand']

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
