/**
 * APPLICATION LAYER - Login & Token Use Cases
 * Casos de uso para iniciar sesión y renovar tokens.
 * Persisten la sesión exclusivamente a través de IAuthSessionRepository.
 */

import type { IUseCase, IAuthSessionRepository, ILoginRequest, IRefreshTokenRequest, ILoginResponse, IRefreshTokenResponse, ILoginResponseError, IRefreshTokenResponseError } from '../../../Domain';
import type { IAuthService } from '../../Services/Auth/IAuthService';
import { AuthSession } from '../../../Domain/Entities/AuthSession';
import { AuthTokens } from '../../../Domain/ValueObjects';

/** JWT claims extraídos del access token. */
interface JwtPayload {
    sub?: string;
    email?: string;
    name?: string;
    exp?: number;
}

export type LoginOutput = ILoginResponse | ILoginResponseError;

/**
 * Inicia sesión, crea la AuthSession desde JWT claims, y la persiste.
 */
export class LoginUserUseCase implements IUseCase<ILoginRequest, LoginOutput> {
    private readonly authService: IAuthService;
    private readonly authSessionRepo: IAuthSessionRepository;

    constructor(
        authService: IAuthService,
        authSessionRepo: IAuthSessionRepository
    ) {
        this.authService = authService;
        this.authSessionRepo = authSessionRepo;
    }

    async execute(input: ILoginRequest): Promise<LoginOutput> {
        const result = await this.authService.login(input);

        if (!this.isSuccess(result)) return result;

        const claims = this.decodeJwt(result.accessToken);
        const userId = claims.sub;
        const userEmail = claims.email ?? input.email;

        if (!userId?.trim()) {
            return { title: 'Authentication Error', status: 500, detail: 'JWT inválido: falta el campo sub' };
        }

        const tokens = AuthTokens.createWithExpiry(
            result.accessToken,
            result.refreshToken,
            // La API devuelve refreshTokenExpiry como ISO date — convertimos a segundos de duración
            this.isoToExpiresInSeconds(result.refreshTokenExpiry)
        );

        const session = AuthSession.create({
            tokens,
            user: { id: userId, email: userEmail, name: claims.name }
        });

        await this.authSessionRepo.saveSession(session);

        return result;
    }

    private isSuccess(r: ILoginResponse | ILoginResponseError): r is ILoginResponse {
        return 'accessToken' in r && 'refreshToken' in r;
    }

    private isoToExpiresInSeconds(iso: string): number {
        const expiry = new Date(iso).getTime();
        const now = Date.now();
        return Math.max(0, Math.floor((expiry - now) / 1000));
    }

    private decodeJwt(token: string): JwtPayload {
        try {
            const [, payload] = token.split('.');
            let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            b64 += '='.repeat((4 - b64.length % 4) % 4);
            return JSON.parse(atob(b64));
        } catch {
            return {};
        }
    }
}

/**
 * Renueva tokens y actualiza la AuthSession persistida.
 */
export class RefreshTokenUseCases implements IUseCase<IRefreshTokenRequest, IRefreshTokenResponse | IRefreshTokenResponseError> {
    private readonly authService: IAuthService;
    private readonly authSessionRepo: IAuthSessionRepository;

    constructor(
        authService: IAuthService,
        authSessionRepo: IAuthSessionRepository
    ) {
        this.authService = authService;
        this.authSessionRepo = authSessionRepo;
    }

    async execute(input: IRefreshTokenRequest): Promise<IRefreshTokenResponse | IRefreshTokenResponseError> {
        const result = await this.authService.refreshToken(input);

        if (!this.isSuccess(result)) return result;

        const currentSession = await this.authSessionRepo.getSession();
        if (currentSession) {
            const newSession = currentSession.updateTokens(
                result.accessToken,
                result.refreshToken,
                this.isoToExpiresInSeconds(result.refreshTokenExpiry)
            );
            await this.authSessionRepo.saveSession(newSession);
        }

        return result;
    }

    private isSuccess(r: IRefreshTokenResponse | IRefreshTokenResponseError): r is IRefreshTokenResponse {
        return 'accessToken' in r && 'refreshToken' in r;
    }

    private isoToExpiresInSeconds(iso: string): number {
        const expiry = new Date(iso).getTime();
        return Math.max(0, Math.floor((expiry - Date.now()) / 1000));
    }
}
