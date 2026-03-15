/**
 * APPLICATION LAYER - CheckAuthSessionUseCase
 * Caso de uso para verificar la sesión al arrancar la app.
 * Recupera la sesión persistida y valida su vigencia.
 */

import type { IUseCase } from '../../../Domain';
import type { IAuthSessionRepository } from '../../../Domain';
import { AuthSession } from '../../../Domain/Entities/AuthSession';

/**
 * Output del caso de uso.
 */
export interface CheckAuthSessionOutput {
    isAuthenticated: boolean;
    session: AuthSession | null;
}

/**
 * Caso de uso para verificar la sesión de autenticación.
 */
export class CheckAuthSessionUseCase implements IUseCase<void, CheckAuthSessionOutput> {
    private readonly authSessionRepo: IAuthSessionRepository;

    constructor(authSessionRepo: IAuthSessionRepository) {
        this.authSessionRepo = authSessionRepo;
    }

    async execute(): Promise<CheckAuthSessionOutput> {
        const session = await this.authSessionRepo.getSession();

        if (!session) {
            return { isAuthenticated: false, session: null };
        }

        if (session.isAccessTokenExpired()) {
            await this.authSessionRepo.clearSession();
            return { isAuthenticated: false, session: null };
        }

        return { isAuthenticated: true, session };
    }
}
