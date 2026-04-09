/**
 * APPLICATION LAYER - DeleteActivityUseCase
 * Caso de uso para eliminar una actividad existente.
 */

import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { IActivityService } from '../../Services/Activity/IActivityService'

/**
 * Input del caso de uso
 */
export interface DeleteActivityInput {
  id: string // UUID
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type DeleteActivityOutput =
  | { success: true }
  | { success: false; error: ApiErrorResponse }

/**
 * Caso de uso para eliminar una actividad existente.
 * DELETE /api/v1/activities/{id}
 */
export class DeleteActivityUseCase implements IUseCase<
  DeleteActivityInput,
  DeleteActivityOutput
> {
  private readonly activityService: IActivityService

  constructor(activityService: IActivityService) {
    this.activityService = activityService
  }

  async execute(input: DeleteActivityInput): Promise<DeleteActivityOutput> {
    const result = await this.activityService.deleteActivity(input.id)

    if (result && this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true }
  }

  private isError(result: void | ApiErrorResponse): result is ApiErrorResponse {
    return (
      !!result &&
      ('title' in result || 'detail' in result || 'status' in result)
    )
  }
}
