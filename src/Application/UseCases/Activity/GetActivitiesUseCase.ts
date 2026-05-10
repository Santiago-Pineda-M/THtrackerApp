/**
 * APPLICATION LAYER - GetActivitiesUseCase
 * Caso de uso para obtener todas las actividades del usuario autenticado.
 */

import type { IUseCase, ApiActivitiesTypes } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'

type ActivityPaginatedResponse = ApiActivitiesTypes['ActivityPaginatedResponse']
type GetActivitiesFilters = ApiActivitiesTypes['GetActivitiesFilters']
type ApiErrorResponse = ApiActivitiesTypes['ProblemDetails']

/**
 * Caso de uso para obtener todas las actividades del usuario autenticado.
 * GET /api/v1/activities
 */
export class GetActivitiesUseCase implements IUseCase<
  GetActivitiesFilters,
  ActivityPaginatedResponse | ApiErrorResponse
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(
    filters: GetActivitiesFilters
  ): Promise<ActivityPaginatedResponse | ApiErrorResponse> {
    return await this.activityService.getActivities(filters)
  }
}
