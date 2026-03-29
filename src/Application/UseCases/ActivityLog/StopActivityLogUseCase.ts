/**
 * APPLICATION LAYER - Caso de Uso para detener un registro de actividad
 */

import type { IUseCase, ApiErrorResponse, ActivityLogResponse } from '../../../Domain';
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService';

export interface StopActivityLogRequest {
    logId: string;
}

export type StopActivityLogResult = 
    | { success: true; log: ActivityLogResponse }
    | { success: false; error: ApiErrorResponse };

export class StopActivityLogUseCase implements IUseCase<StopActivityLogRequest, StopActivityLogResult> {
    private readonly activityLogService: IActivityLogService;
    constructor(activityLogService: IActivityLogService) {
        this.activityLogService = activityLogService;
    }

    async execute(request: StopActivityLogRequest): Promise<StopActivityLogResult> {
        const result = await this.activityLogService.stopActivityLog(request.logId);

        if ('id' in result) {
            return { success: true, log: result as ActivityLogResponse };
        }

        return { success: false, error: result as ApiErrorResponse };
    }
}
