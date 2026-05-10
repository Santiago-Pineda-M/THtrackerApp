/**
 * APPLICATION LAYER - Caso de Uso para guardar los valores personalizados de un log (métricas)
 */

import type { IUseCase, ApiActivityLogsTypes } from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
type SaveLogValuesCommand = ApiActivityLogsTypes['SaveLogValuesCommand']
type GetActivityLogValuesParams =
  ApiActivityLogsTypes['GetActivityLogValuesParams']

export class SaveActivityLogValuesUseCase implements IUseCase<
  {
    id: GetActivityLogValuesParams
    requests: SaveLogValuesCommand[]
  },
  void | ProblemDetails
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(input: {
    id: GetActivityLogValuesParams
    requests: SaveLogValuesCommand[]
  }): Promise<void | ProblemDetails> {
    return await this.activityLogService.saveActivityLogValues(
      input.id,
      input.requests
    )
  }
}
