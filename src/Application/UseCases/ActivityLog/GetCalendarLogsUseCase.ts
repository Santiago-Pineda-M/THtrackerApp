/**
 * APPLICATION LAYER - Caso de Uso para obtener logs filtrados por fecha
 */

import type {
  IUseCase,
  ApiErrorResponse,
  ActivityLogResponse,
} from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export interface GetCalendarLogsRequest {
  startDate: Date
  endDate: Date
}

export type GetCalendarLogsResult =
  | { success: true; logs: ActivityLogResponse[] }
  | { success: false; error: ApiErrorResponse }

export class GetCalendarLogsUseCase implements IUseCase<
  GetCalendarLogsRequest,
  GetCalendarLogsResult
> {
  private readonly activityLogService: IActivityLogService

  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: GetCalendarLogsRequest
  ): Promise<GetCalendarLogsResult> {
    const result = await this.activityLogService.getActivityLogs({
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
    })

    if (Array.isArray(result)) {
      return { success: true, logs: result }
    }

    return { success: false, error: result as ApiErrorResponse }
  }
}
