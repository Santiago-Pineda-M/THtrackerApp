/**
 * APPLICATION LAYER - GetActivitiesUseCase
 * Caso de uso para obtener todas las actividades del usuario autenticado.
 */

import type { IUseCase, ApiActivitiesTypes } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'

export type ActivityPaginatedResponse =
  ApiActivitiesTypes['ActivityPaginatedResponse']
export type GetActivitiesFilters = ApiActivitiesTypes['GetActivitiesFilters']
export type ProblemDetails = ApiActivitiesTypes['ProblemDetails']

/**
 * Caso de uso para obtener todas las actividades del usuario autenticado.
 * GET /api/v1/activities
 */
export class GetActivitiesUseCase implements IUseCase<
  GetActivitiesFilters,
  ActivityPaginatedResponse | ProblemDetails
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(
    filters: GetActivitiesFilters
  ): Promise<ActivityPaginatedResponse | ProblemDetails> {
    return await this.activityService.getActivities(filters)
  }
}
