/**
 * APPLICATION LAYER - GetActivitiesUseCase
 * Caso de uso para obtener todas las actividades del usuario autenticado.
 */

import type { IUseCase } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'
import type { ActivityResponse, ApiErrorResponse } from '../../../Domain'

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type GetActivitiesOutput =
  | { success: true; activities: ActivityResponse[] }
  | { success: false; error: ApiErrorResponse }

/**
 * Caso de uso para obtener todas las actividades del usuario autenticado.
 * GET /api/v1/activities
 */
export class GetActivitiesUseCase implements IUseCase<
  void,
  GetActivitiesOutput
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(): Promise<GetActivitiesOutput> {
    const result = await this.activityService.getActivities()

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, activities: result }
  }

  private isError(
    result: ActivityResponse[] | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
