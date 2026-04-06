/**
 * APPLICATION LAYER - UpdateActivityValueDefinitionUseCase
 * Actualiza una definición de valor existente para una actividad.
 */

import type { IUseCase } from '../../../Domain';
import type { IActivityValueDefinitionService } from '../../Services/ActivityValueDefinition/IActivityValueDefinitionService';
import type {
    ActivityValueDefinitionResponse,
    UpdateValueDefinitionRequest,
    ApiErrorResponse,
} from '../../../Domain';

export interface UpdateActivityValueDefinitionInput {
    activityId: string;
    id: string;
    name: string | null;
    valueType: string | null;
    isRequired: boolean;
    unit: string | null;
    minValue: string | null;
    maxValue: string | null;
}

export type UpdateActivityValueDefinitionOutput =
    | { success: true; definition: ActivityValueDefinitionResponse }
    | { success: false; error: ApiErrorResponse };

export class UpdateActivityValueDefinitionUseCase implements IUseCase<UpdateActivityValueDefinitionInput, UpdateActivityValueDefinitionOutput> {
    private readonly activityValueDefinitionService: IActivityValueDefinitionService;

    constructor(activityValueDefinitionService: IActivityValueDefinitionService) {
        this.activityValueDefinitionService = activityValueDefinitionService;
    }

    async execute(input: UpdateActivityValueDefinitionInput): Promise<UpdateActivityValueDefinitionOutput> {
        const request: UpdateValueDefinitionRequest = {
            name: input.name,
            valueType: input.valueType,
            isRequired: input.isRequired,
            unit: input.unit,
            minValue: input.minValue,
            maxValue: input.maxValue,
        };

        const result = await this.activityValueDefinitionService.updateValueDefinition(input.activityId, input.id, request);

        if (this.isDefinition(result)) {
            return { success: true, definition: result };
        }

        return { success: false, error: result as ApiErrorResponse };
    }

    private isDefinition(result: ActivityValueDefinitionResponse | ApiErrorResponse): result is ActivityValueDefinitionResponse {
        return 'activityId' in result;
    }
}