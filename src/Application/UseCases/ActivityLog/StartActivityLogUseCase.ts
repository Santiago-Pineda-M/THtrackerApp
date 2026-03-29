/**
 * APPLICATION LAYER - Caso de Uso para iniciar un registro de actividad
 */

import type { IUseCase, ApiErrorResponse, ActivityLogResponse, StartActivityLogRequest } from '../../../Domain';
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService';

export type StartActivityLogResult = 
    | { success: true; log: ActivityLogResponse }
    | { success: false; error: ApiErrorResponse };

export class StartActivityLogUseCase implements IUseCase<StartActivityLogRequest, StartActivityLogResult> {
    private readonly activityLogService: IActivityLogService;
    constructor(activityLogService: IActivityLogService) {
        this.activityLogService = activityLogService;
    }

    async execute(request: StartActivityLogRequest): Promise<StartActivityLogResult> {
        const result = await this.activityLogService.startActivityLog(request);

        if ('id' in result) {
            return { success: true, log: result as ActivityLogResponse };
        }

        return { success: false, error: result as ApiErrorResponse };
    }
}
