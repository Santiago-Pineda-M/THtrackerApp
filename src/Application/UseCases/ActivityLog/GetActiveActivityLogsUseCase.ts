/**
 * APPLICATION LAYER - Caso de Uso para obtener todos los registros de actividad activos (en curso)
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
type ActivityLogResponsePaginated =
  ApiActivityLogsTypes['ActivityLogResponsePaginated']
type GetActiveActivityLogsFilters =
  ApiActivityLogsTypes['GetActiveActivityLogsFilters']

export class GetActiveActivityLogsUseCase implements IUseCase<
  GetActiveActivityLogsFilters,
  ActivityLogResponsePaginated | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    filters: GetActiveActivityLogsFilters
  ): Promise<ActivityLogResponsePaginated | ProblemDetails> {
    return await this.activityLogService.getActiveActivityLogs(filters)
  }
}
