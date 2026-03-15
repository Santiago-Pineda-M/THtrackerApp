/**
 * INFRASTRUCTURE LAYER - AuthSessionRepository
 * Implementación de IAuthSessionRepository que usa SecureStorage.
 */

import type { IAuthSessionRepository } from '../../Domain/Repositories/IAuthSessionRepository';
import { AuthSession } from '../../Domain/Entities/AuthSession';
import type { ISecureStorage } from '../../Domain/IPatterns';

const AUTH_SESSION_KEY = 'auth_session';

export class AuthSessionRepository implements IAuthSessionRepository {
    private readonly secureStorage: ISecureStorage;

    constructor(secureStorage: ISecureStorage) {
        this.secureStorage = secureStorage;
    }

    async getSession(): Promise<AuthSession | null> {
        try {
            const dataString = await this.secureStorage.get(AUTH_SESSION_KEY);
            if (!dataString) return null;
            return AuthSession.fromJSON(dataString);
        } catch {
            return null;
        }
    }

    async saveSession(session: AuthSession): Promise<void> {
        try {
            const jsonStr = session.toJSON();
            await this.secureStorage.set(AUTH_SESSION_KEY, jsonStr);
        } catch {
            throw new Error('Failed to save session');
        }
    }

    async clearSession(): Promise<void> {
        try {
            await this.secureStorage.delete(AUTH_SESSION_KEY);
        } catch {
            throw new Error('Failed to clear session');
        }
    }

}
