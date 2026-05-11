/**
 * APPLICATION LAYER - UpdateActivityUseCase
 * Caso de uso para actualizar una actividad existente.
 */

import type { IUseCase, ApiActivitiesTypes } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'

/**
 * Input del caso de uso
 */
export type UpdateActivityRequest = ApiActivitiesTypes['UpdateActivityCommand']
export type ActivityResponse = ApiActivitiesTypes['ActivityResponse']
export type ProblemDetails = ApiActivitiesTypes['ProblemDetails']
export type UpdateActivityPath = ApiActivitiesTypes['UpdateActivityPath']

/**
 * Caso de uso para actualizar una actividad existente.
 * PUT /api/v1/activities/{id}
 */
export class UpdateActivityUseCase implements IUseCase<
  UpdateActivityRequest,
  ActivityResponse | ProblemDetails
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(
    input: UpdateActivityRequest
  ): Promise<ActivityResponse | ProblemDetails> {
    const path: UpdateActivityPath = { id: input.id || '' }
    return await this.activityService.updateActivity(path, input)
  }
}
