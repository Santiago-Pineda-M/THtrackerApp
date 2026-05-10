/**
 * APPLICATION LAYER - GetActivityByIdUseCase
 * Caso de uso para obtener una actividad específica por su ID.
 */

import type { IUseCase, ApiActivitiesTypes } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'

type ActivityResponse = ApiActivitiesTypes['ActivityResponse']
type ApiErrorResponse = ApiActivitiesTypes['ProblemDetails']
type GetActivityByIdInput = ApiActivitiesTypes['GetActivityIdPath']

/**
 * Caso de uso para obtener una actividad específica por su ID.
 * GET /api/v1/activities/{id}
 */
export class GetActivityByIdUseCase implements IUseCase<
  GetActivityByIdInput,
  ActivityResponse | ApiErrorResponse
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(
    input: GetActivityByIdInput
  ): Promise<ActivityResponse | ApiErrorResponse> {
    const result = await this.activityService.getActivityById(input)
    return result
  }
}
