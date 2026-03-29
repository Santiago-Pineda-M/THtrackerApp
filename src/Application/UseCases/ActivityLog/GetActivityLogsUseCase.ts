/**
 * APPLICATION LAYER - Caso de Uso para obtener logs de una actividad
 */

import type { IUseCase, ApiErrorResponse, ActivityLogResponse } from '../../../Domain';
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService';

export interface GetActivityLogsRequest {
    activityId: string;
}

export type GetActivityLogsResult = 
    | { success: true; logs: ActivityLogResponse[] }
    | { success: false; error: ApiErrorResponse };

export class GetActivityLogsUseCase implements IUseCase<GetActivityLogsRequest, GetActivityLogsResult> {
    private readonly activityLogService: IActivityLogService;
    constructor(activityLogService: IActivityLogService) {
        this.activityLogService = activityLogService;
    }

    async execute(request: GetActivityLogsRequest): Promise<GetActivityLogsResult> {
        const result = await this.activityLogService.getActivityLogs(request.activityId);

        if (Array.isArray(result)) {
            return { success: true, logs: result };
        }

        return { success: false, error: result as ApiErrorResponse };
    }
}
