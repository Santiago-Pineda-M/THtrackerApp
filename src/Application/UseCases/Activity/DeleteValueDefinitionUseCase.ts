/**
 * APPLICATION LAYER - DeleteValueDefinitionUseCase
 * Elimina una definición de valor existente para una actividad.
 */

import type { IUseCase, ApiErrorResponse } from '../../../Domain';
import type { IActivityService } from '../../Services/Activity/IActivityService';

/**
 * Input del caso de uso
 */
export interface DeleteValueDefinitionInput {
    activityId: string;
    id: string;
}

/**
 * Output del caso de uso - puede ser éxito o error
 */
export type DeleteValueDefinitionOutput =
    | { success: true }
    | { success: false; error: ApiErrorResponse };

/**
 * Caso de uso para eliminar una definición de valor existente.
 * DELETE /api/v1/activities/{activityId}/definitions/{id}
 */
export class DeleteValueDefinitionUseCase implements IUseCase<DeleteValueDefinitionInput, DeleteValueDefinitionOutput> {
    private readonly activityService: IActivityService;

    constructor(activityService: IActivityService) {
        this.activityService = activityService;
    }

    async execute(input: DeleteValueDefinitionInput): Promise<DeleteValueDefinitionOutput> {
        const result = await this.activityService.deleteValueDefinition(input.activityId, input.id);

        if (result && this.isError(result)) {
            return { success: false, error: result };
        }

        return { success: true };
    }

    private isError(result: void | ApiErrorResponse): result is ApiErrorResponse {
        return !!result && ('title' in result || 'detail' in result || 'status' in result);
    }
}