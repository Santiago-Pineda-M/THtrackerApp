/**
 * APPLICATION LAYER - Caso de Uso para obtener todos los registros de actividad activos (en curso)
 */

import type {
  IUseCase,
  ApiErrorResponse,
  ActivityLogResponse,
} from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export type GetActiveActivityLogsResult =
  | { success: true; logs: ActivityLogResponse[] }
  | { success: false; error: ApiErrorResponse }

export class GetActiveActivityLogsUseCase implements IUseCase<
  void,
  GetActiveActivityLogsResult
> {
  private readonly activityLogService: IActivityLogService

  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(): Promise<GetActiveActivityLogsResult> {
    const result = await this.activityLogService.getActiveActivityLogs()

    if (Array.isArray(result)) {
      return { success: true, logs: result }
    }

    return { success: false, error: result as ApiErrorResponse }
  }
}
