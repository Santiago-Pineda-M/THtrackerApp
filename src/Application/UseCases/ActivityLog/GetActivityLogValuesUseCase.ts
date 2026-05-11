/**
 * APPLICATION LAYER - Caso de Uso para obtener los valores personalizados de un log
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
export type LogValueResponsePaginated =
  ApiActivityLogsTypes['LogValueResponsePaginated']
export type GetActivityLogValuesRequest =
  ApiActivityLogsTypes['GetActivityLogValuesParams']

export class GetActivityLogValuesUseCase implements IUseCase<
  GetActivityLogValuesRequest,
  LogValueResponsePaginated | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: GetActivityLogValuesRequest
  ): Promise<LogValueResponsePaginated | ProblemDetails> {
    return await this.activityLogService.getActivityLogValues(request)
  }
}
