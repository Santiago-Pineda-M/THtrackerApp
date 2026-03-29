/**
 * APPLICATION LAYER - GetActivityByIdUseCase
 * Caso de uso para obtener una actividad específica por su ID.
 */

import type { IUseCase } from '../../../Domain';
import type { IActivityService } from '../../Services/Activity/IActivityService';
import type { ActivityResponse, ApiErrorResponse } from '../../../Domain';

/**
 * Input del caso de uso
 */
export interface GetActivityByIdInput {
    id: string; // UUID
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type GetActivityByIdOutput = 
    | { success: true; activity: ActivityResponse }
    | { success: false; error: ApiErrorResponse };

/**
 * Caso de uso para obtener una actividad específica por su ID.
 * GET /api/v1/activities/{id}
 */
export class GetActivityByIdUseCase implements IUseCase<GetActivityByIdInput, GetActivityByIdOutput> {
    private readonly activityService: IActivityService;

    constructor(activityService: IActivityService) {
        this.activityService = activityService;
    }

    async execute(input: GetActivityByIdInput): Promise<GetActivityByIdOutput> {
        const result = await this.activityService.getActivityById(input.id);

        if (this.isError(result)) {
            return { success: false, error: result };
        }

        return { success: true, activity: result };
    }

    private isError(result: ActivityResponse | ApiErrorResponse): result is ApiErrorResponse {
        return 'title' in result || 'detail' in result || 'status' in result;
    }
}
