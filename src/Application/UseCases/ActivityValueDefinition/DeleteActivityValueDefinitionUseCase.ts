/**
 * APPLICATION LAYER - DeleteActivityValueDefinitionUseCase
 * Elimina una definición de valor existente para una actividad.
 */

import type { IUseCase } from '../../../Domain';
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService';
import type { ApiErrorResponse } from '../../../Domain';

export interface DeleteActivityValueDefinitionInput {
    activityId: string;
    id: string;
}

export type DeleteActivityValueDefinitionOutput =
    | { success: true }
    | { success: false; error: ApiErrorResponse };

export class DeleteActivityValueDefinitionUseCase implements IUseCase<DeleteActivityValueDefinitionInput, DeleteActivityValueDefinitionOutput> {
    private readonly activityValueDefinitionService: IActivityValueDefinitionService;

    constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
        this.activityValueDefinitionService = activityValueDefinitionService;
    }

    async execute(input: DeleteActivityValueDefinitionInput): Promise<DeleteActivityValueDefinitionOutput> {
        const result = await this.activityValueDefinitionService.deleteValueDefinition(input.activityId, input.id);

        if (result === undefined) {
            return { success: true };
        }

        return { success: false, error: result as ApiErrorResponse };
    }
}