/**
 * APPLICATION LAYER - LogoutUseCase
 * Caso de uso para cerrar sesión.
 * Limpia la sesión persistida y notifica al servidor.
 */

import type { IUseCase } from '../../Domain';
import type { IAuthSessionRepository } from '../../Domain';
import type { IAuthService } from '../Interfaces/IServices/IAuthService';

/**
 * Input del caso de uso.
 */
export interface LogoutInput {
    notifyServer?: boolean;
}

/**
 * Output del caso de uso.
 */
export interface LogoutOutput {
    success: boolean;
    message: string;
}

/**
 * Caso de uso para cerrar sesión.
 */
export class LogoutUseCase implements IUseCase<LogoutInput, LogoutOutput> {
    private readonly authSessionRepo: IAuthSessionRepository;
    private readonly authService: IAuthService;

    constructor(authSessionRepo: IAuthSessionRepository, authService: IAuthService) {
        this.authSessionRepo = authSessionRepo;
        this.authService = authService;
    }

    async execute(input?: LogoutInput): Promise<LogoutOutput> {
        try {
            // Notificar al servidor si se requiere
            if (input?.notifyServer) {
                await this.authService.logout();
            }

            // Limpiar sesión local
            await this.authSessionRepo.clearSession();

            return {
                success: true,
                message: 'Sesión cerrada correctamente',
            };
        } catch {
            // Siempre limpiamos la sesión local aunque el servidor falle
            await this.authSessionRepo.clearSession();

            return {
                success: true,
                message: 'Sesión cerrada localmente',
            };
        }
    }
}
