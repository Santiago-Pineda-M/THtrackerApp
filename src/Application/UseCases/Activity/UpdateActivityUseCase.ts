/**
 * APPLICATION LAYER - UpdateActivityUseCase
 * Caso de uso para actualizar una actividad existente.
 */

import type { IUseCase } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'
import type {
  UpdateActivityRequest,
  ActivityResponse,
  ApiErrorResponse,
} from '../../../Domain'

/**
 * Input del caso de uso
 */
export interface UpdateActivityInput {
  id: string // UUID
  name: string | null
  color: string | null
  allowOverlap: boolean
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type UpdateActivityOutput =
  | { success: true; activity: ActivityResponse }
  | { success: false; error: ApiErrorResponse }

/**
 * Caso de uso para actualizar una actividad existente.
 * PUT /api/v1/activities/{id}
 */
export class UpdateActivityUseCase implements IUseCase<
  UpdateActivityInput,
  UpdateActivityOutput
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(input: UpdateActivityInput): Promise<UpdateActivityOutput> {
    const request: UpdateActivityRequest = {
      name: input.name,
      color: input.color,
      allowOverlap: input.allowOverlap,
    }

    const result = await this.activityService.updateActivity(input.id, request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, activity: result }
  }

  private isError(
    result: ActivityResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
