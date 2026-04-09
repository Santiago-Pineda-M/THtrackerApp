/**
 * APPLICATION LAYER - CreateActivityUseCase
 * Caso de uso para crear una nueva actividad.
 */

import type { IUseCase } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'
import type {
  CreateActivityRequest,
  ActivityResponse,
  ApiErrorResponse,
} from '../../../Domain'

/**
 * Input del caso de uso
 */
export interface CreateActivityInput {
  categoryId: string
  name: string | null
  color: string | null
  allowOverlap: boolean
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type CreateActivityOutput =
  | { success: true; activity: ActivityResponse }
  | { success: false; error: ApiErrorResponse }

/**
 * Caso de uso para crear una nueva actividad.
 * POST /api/v1/activities
 */
export class CreateActivityUseCase implements IUseCase<
  CreateActivityInput,
  CreateActivityOutput
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(input: CreateActivityInput): Promise<CreateActivityOutput> {
    const request: CreateActivityRequest = {
      categoryId: input.categoryId,
      name: input.name,
      color: input.color,
      allowOverlap: input.allowOverlap,
    }

    const result = await this.activityService.createActivity(request)

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
