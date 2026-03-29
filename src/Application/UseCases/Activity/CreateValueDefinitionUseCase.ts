/**
 * APPLICATION LAYER - CreateValueDefinitionUseCase
 * Crea una nueva definición de valor para una actividad.
 */

import type { IUseCase } from '../../../Domain';
import type { IActivityService } from '../../Services/Activity/IActivityService';
import type {
    ActivityValueDefinitionResponse,
    CreateValueDefinitionRequest,
    ApiErrorResponse,
} from '../../../Domain';

export interface CreateValueDefinitionInput {
    activityId: string;
    name: string | null;
    valueType: string | null;
    isRequired: boolean;
    unit: string | null;
    minValue: string | null;
    maxValue: string | null;
}

export type CreateValueDefinitionOutput =
    | { success: true; definition: ActivityValueDefinitionResponse }
    | { success: false; error: ApiErrorResponse };

export class CreateValueDefinitionUseCase implements IUseCase<CreateValueDefinitionInput, CreateValueDefinitionOutput> {
    private readonly activityService: IActivityService;

    constructor(activityService: IActivityService) {
        this.activityService = activityService;
    }

    async execute(input: CreateValueDefinitionInput): Promise<CreateValueDefinitionOutput> {
        const request: CreateValueDefinitionRequest = {
            name: input.name,
            valueType: input.valueType,
            isRequired: input.isRequired,
            unit: input.unit,
            minValue: input.minValue,
            maxValue: input.maxValue,
        };

        const result = await this.activityService.createValueDefinition(input.activityId, request);

        if (this.isDefinition(result)) {
            return { success: true, definition: result };
        }

        return { success: false, error: result as ApiErrorResponse };
    }

    private isDefinition(result: ActivityValueDefinitionResponse | ApiErrorResponse): result is ActivityValueDefinitionResponse {
        return 'activityId' in result;
    }
}
