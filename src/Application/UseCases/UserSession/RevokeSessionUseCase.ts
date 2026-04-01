/**
 * APPLICATION LAYER - RevokeSessionUseCase
 * Caso de uso para revocar una sesión específica del usuario autenticado.
 */

import type { IUseCase, IRevokeSessionRequest } from '../../../Domain';
import type { IUserSessionService } from '../../Services/UserSession/IUserSessionService';

/**
 * Output del caso de uso.
 */
export interface RevokeSessionOutput {
    success: boolean;
    revokedSessionId: string;
}

/**
 * Caso de uso para revocar una sesión.
 * Utiliza el servicio de sesiones para enviar la solicitud a la API.
 */
export class RevokeSessionUseCase implements IUseCase<IRevokeSessionRequest, RevokeSessionOutput> {
    private readonly userSessionService: IUserSessionService;

    constructor(userSessionService: IUserSessionService) {
        this.userSessionService = userSessionService;
    }

    async execute(input: IRevokeSessionRequest): Promise<RevokeSessionOutput> {
        const result = await this.userSessionService.revokeSession(input.sessionId);
        return {
            success: result.success,
            revokedSessionId: input.sessionId,
        };
    }
}
