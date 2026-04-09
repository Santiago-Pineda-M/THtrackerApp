/**
 * APPLICATION LAYER - Caso de Uso para obtener el detalle de un registro de actividad por ID
 */

import type {
  IUseCase,
  ApiErrorResponse,
  ActivityLogResponse,
} from '../../../Domain'
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService'

export interface GetActivityLogByIdRequest {
  id: string
}

export type GetActivityLogByIdResult =
  | { success: true; log: ActivityLogResponse }
  | { success: false; error: ApiErrorResponse }

export class GetActivityLogByIdUseCase implements IUseCase<
  GetActivityLogByIdRequest,
  GetActivityLogByIdResult
> {
  private readonly activityLogService: IActivityLogService
  constructor(activityLogService: IActivityLogService) {
    this.activityLogService = activityLogService
  }

  async execute(
    request: GetActivityLogByIdRequest
  ): Promise<GetActivityLogByIdResult> {
    const result = await this.activityLogService.getActivityLogById(request.id)

    if ('id' in result) {
      return { success: true, log: result as ActivityLogResponse }
    }

    return { success: false, error: result as ApiErrorResponse }
  }
}
