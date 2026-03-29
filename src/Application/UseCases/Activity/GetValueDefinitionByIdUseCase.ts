/**
 * APPLICATION LAYER - GetValueDefinitionByIdUseCase
 * Obtiene una definición de valor específica por su ID.
 */

import type { IUseCase } from '../../../Domain';
import type { IActivityService } from '../../Services/Activity/IActivityService';
import type { ActivityValueDefinitionResponse, ApiErrorResponse } from '../../../Domain';

export interface GetValueDefinitionByIdInput {
    activityId: string;
    definitionId: string;
}

export type GetValueDefinitionByIdOutput =
    | { success: true; definition: ActivityValueDefinitionResponse }
    | { success: false; error: ApiErrorResponse };

export class GetValueDefinitionByIdUseCase implements IUseCase<GetValueDefinitionByIdInput, GetValueDefinitionByIdOutput> {
    private readonly activityService: IActivityService;

    constructor(activityService: IActivityService) {
        this.activityService = activityService;
    }

    async execute(input: GetValueDefinitionByIdInput): Promise<GetValueDefinitionByIdOutput> {
        const result = await this.activityService.getValueDefinitionById(input.activityId, input.definitionId);

        if (this.isDefinition(result)) {
            return { success: true, definition: result };
        }

        return { success: false, error: result as ApiErrorResponse };
    }

    private isDefinition(result: ActivityValueDefinitionResponse | ApiErrorResponse): result is ActivityValueDefinitionResponse {
        return 'activityId' in result;
    }
}
