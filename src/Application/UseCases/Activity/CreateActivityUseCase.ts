/**
 * APPLICATION LAYER - CreateActivityUseCase
 * Caso de uso para crear una nueva actividad.
 */

import type { IUseCase, ApiActivitiesTypes } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'

export type CreateActivityRequest = ApiActivitiesTypes['CreateActivityCommand']
export type ActivityResponse = ApiActivitiesTypes['ActivityResponse']
export type ProblemDetails = ApiActivitiesTypes['ProblemDetails']

/**
 * Caso de uso para crear una nueva actividad.
 * POST /api/v1/activities
 */
export class CreateActivityUseCase implements IUseCase<
  CreateActivityRequest,
  ActivityResponse | ProblemDetails
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(
    input: CreateActivityRequest
  ): Promise<ActivityResponse | ProblemDetails> {
    const result = await this.activityService.createActivity(input)

    return result
  }
}
