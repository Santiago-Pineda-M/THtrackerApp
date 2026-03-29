/**
 * APPLICATION LAYER - GetValueDefinitionsUseCase
 * Lista las definiciones de valor de una actividad.
 */

import type { IUseCase } from '../../../Domain';
import type { IActivityService } from '../../Services/Activity/IActivityService';
import type { ActivityValueDefinitionResponse, ApiErrorResponse } from '../../../Domain';

export interface GetValueDefinitionsInput {
    activityId: string;
}

export type GetValueDefinitionsOutput =
    | { success: true; definitions: ActivityValueDefinitionResponse[] }
    | { success: false; error: ApiErrorResponse };

export class GetValueDefinitionsUseCase implements IUseCase<GetValueDefinitionsInput, GetValueDefinitionsOutput> {
    private readonly activityService: IActivityService;

    constructor(activityService: IActivityService) {
        this.activityService = activityService;
    }

    async execute(input: GetValueDefinitionsInput): Promise<GetValueDefinitionsOutput> {
        const result = await this.activityService.getValueDefinitions(input.activityId);

        if (Array.isArray(result)) {
            return { success: true, definitions: result };
        }

        return { success: false, error: result as ApiErrorResponse };
    }
}
