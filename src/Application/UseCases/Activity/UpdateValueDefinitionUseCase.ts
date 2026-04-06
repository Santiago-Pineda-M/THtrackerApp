/**
 * APPLICATION LAYER - UpdateValueDefinitionUseCase
 * Actualiza una definición de valor existente para una actividad.
 */

import type { IUseCase } from '../../../Domain';
import type { IActivityService } from '../../Services/Activity/IActivityService';
import type {
    ActivityValueDefinitionResponse,
    UpdateValueDefinitionRequest,
    ApiErrorResponse,
} from '../../../Domain';

export interface UpdateValueDefinitionInput {
    activityId: string;
    id: string;
    name: string | null;
    valueType: string | null;
    isRequired: boolean;
    unit: string | null;
    minValue: string | null;
    maxValue: string | null;
}

export type UpdateValueDefinitionOutput =
    | { success: true; definition: ActivityValueDefinitionResponse }
    | { success: false; error: ApiErrorResponse };

export class UpdateValueDefinitionUseCase implements IUseCase<UpdateValueDefinitionInput, UpdateValueDefinitionOutput> {
    private readonly activityService: IActivityService;

    constructor(activityService: IActivityService) {
        this.activityService = activityService;
    }

    async execute(input: UpdateValueDefinitionInput): Promise<UpdateValueDefinitionOutput> {
        const request: UpdateValueDefinitionRequest = {
            name: input.name,
            valueType: input.valueType,
            isRequired: input.isRequired,
            unit: input.unit,
            minValue: input.minValue,
            maxValue: input.maxValue,
        };

        const result = await this.activityService.updateValueDefinition(input.activityId, input.id, request);

        if (this.isDefinition(result)) {
            return { success: true, definition: result };
        }

        return { success: false, error: result as ApiErrorResponse };
    }

    private isDefinition(result: ActivityValueDefinitionResponse | ApiErrorResponse): result is ActivityValueDefinitionResponse {
        return 'activityId' in result;
    }
}