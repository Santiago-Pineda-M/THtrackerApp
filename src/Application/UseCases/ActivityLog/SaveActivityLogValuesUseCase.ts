/**
 * APPLICATION LAYER - Caso de Uso para guardar los valores personalizados de un log (métricas)
 */

import type { IUseCase, ApiErrorResponse, LogValueRequest } from '../../../Domain';
import type { IActivityLogService } from '../../Services/ActivityLog/IActivityLogService';

export interface SaveActivityLogValuesCommand {
    id: string; // ID del activity log
    requests: LogValueRequest[];
}

export type SaveActivityLogValuesResult = 
    | { success: true }
    | { success: false; error: ApiErrorResponse };

export class SaveActivityLogValuesUseCase implements IUseCase<SaveActivityLogValuesCommand, SaveActivityLogValuesResult> {
    private readonly activityLogService: IActivityLogService;
    constructor(activityLogService: IActivityLogService) {
        this.activityLogService = activityLogService;
    }

    async execute(command: SaveActivityLogValuesCommand): Promise<SaveActivityLogValuesResult> {
        const result = await this.activityLogService.saveActivityLogValues(command.id, command.requests);

        if (result === undefined) { // El servicio retorna void si hay éxito según IActivityLogService
            return { success: true };
        }

        return { success: false, error: result as ApiErrorResponse };
    }
}
