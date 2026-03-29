/**
 * APPLICATION LAYER - Caso de Uso para obtener los valores personalizados de un log
 */

import type { IUseCase, ApiErrorResponse, LogValueResponse } from '../../../Domain';
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService';

export interface GetActivityLogValuesRequest {
    logId: string;
}

export type GetActivityLogValuesResult = 
    | { success: true; values: LogValueResponse[] }
    | { success: false; error: ApiErrorResponse };

export class GetActivityLogValuesUseCase implements IUseCase<GetActivityLogValuesRequest, GetActivityLogValuesResult> {
    private readonly activityLogService: IActivityLogService;
    constructor(activityLogService: IActivityLogService) {
        this.activityLogService = activityLogService;
    }

    async execute(request: GetActivityLogValuesRequest): Promise<GetActivityLogValuesResult> {
        const result = await this.activityLogService.getActivityLogValues(request.logId);

        if (Array.isArray(result)) {
            return { success: true, values: result };
        }

        return { success: false, error: result as ApiErrorResponse };
    }
}
