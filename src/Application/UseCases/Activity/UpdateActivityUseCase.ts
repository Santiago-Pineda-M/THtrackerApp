/**
 * APPLICATION LAYER - UpdateActivityUseCase
 * Caso de uso para actualizar una actividad existente.
 */

import type { IUseCase, ApiActivitiesTypes } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'

/**
 * Input del caso de uso
 */
type UpdateActivityRequest = ApiActivitiesTypes['UpdateActivityCommand']
type ActivityResponse = ApiActivitiesTypes['ActivityResponse']
type ApiErrorResponse = ApiActivitiesTypes['ProblemDetails']
type UpdateActivityPath = ApiActivitiesTypes['UpdateActivityPath']

/**
 * Caso de uso para actualizar una actividad existente.
 * PUT /api/v1/activities/{id}
 */
export class UpdateActivityUseCase implements IUseCase<
  UpdateActivityRequest,
  ActivityResponse | ApiErrorResponse
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(
    input: UpdateActivityRequest
  ): Promise<ActivityResponse | ApiErrorResponse> {
    const path: UpdateActivityPath = { id: input.id || '' }
    return await this.activityService.updateActivity(path, input)
  }
}
