/**
 * APPLICATION LAYER - Caso de Uso para actualizar los metadatos de un log (fechas)
 */

import type { IUseCase, ApiErrorResponse, ActivityLogResponse, UpdateActivityLogRequest } from '../../../Domain';
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService';

export interface UpdateActivityLogCommand {
    id: string;
    request: UpdateActivityLogRequest;
}

export type UpdateActivityLogResult = 
    | { success: true; log: ActivityLogResponse }
    | { success: false; error: ApiErrorResponse };

export class UpdateActivityLogUseCase implements IUseCase<UpdateActivityLogCommand, UpdateActivityLogResult> {
    private readonly activityLogService: IActivityLogService;
    constructor(activityLogService: IActivityLogService) {
        this.activityLogService = activityLogService;
    }

    async execute(command: UpdateActivityLogCommand): Promise<UpdateActivityLogResult> {
        const result = await this.activityLogService.updateActivityLog(command.id, command.request);

        if ('id' in result) {
            return { success: true, log: result as ActivityLogResponse };
        }

        return { success: false, error: result as ApiErrorResponse };
    }
}
