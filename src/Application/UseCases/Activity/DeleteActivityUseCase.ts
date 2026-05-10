/**
 * APPLICATION LAYER - DeleteActivityUseCase
 * Caso de uso para eliminar una actividad existente.
 */

import type { IUseCase, ApiActivitiesTypes } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'

type ApiErrorResponse = ApiActivitiesTypes['ProblemDetails']
type DeleteActivityPath = ApiActivitiesTypes['DeleteActivityPath']
/**
 * Caso de uso para eliminar una actividad existente.
 * DELETE /api/v1/activities/{id}
 */
export class DeleteActivityUseCase implements IUseCase<
  DeleteActivityPath,
  void | ApiErrorResponse
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(input: DeleteActivityPath): Promise<void | ApiErrorResponse> {
    const response = await this.activityService.deleteActivity(input)
    return response
  }
}
