/**
 * APPLICATION LAYER - RefreshTokenUseCase
 * Caso de uso para renovar tokens de autenticación.
 * Usa el refresh token para obtener nuevos access y refresh tokens.
 */

import type { IUseCase, IAuthSessionRepository, IRefreshTokenRequest, IRefreshTokenResponse, IRefreshTokenResponseError } from '../../../Domain';
import type { IAuthService } from '../../Services/Auth/IAuthService';
import { isoToExpiresInSeconds } from '../../../Domain';

export type RefreshTokenOutput = IRefreshTokenResponse | IRefreshTokenResponseError;

/**
 * Caso de uso para renovar tokens de autenticación.
 * Recibe un refresh token y retorna nuevos tokens actualizados.
 */
export class RefreshTokenUseCases implements IUseCase<IRefreshTokenRequest, RefreshTokenOutput> {
    private readonly authService: IAuthService;
    private readonly authSessionRepo: IAuthSessionRepository;

    constructor(authService: IAuthService, authSessionRepo: IAuthSessionRepository) {
        this.authService = authService;
        this.authSessionRepo = authSessionRepo;
    }

    async execute(input: IRefreshTokenRequest): Promise<RefreshTokenOutput> {
        const result = await this.authService.refreshToken(input);

        if (!this.isSuccess(result)) return result;

        // Actualizar la sesión con los nuevos tokens
        const currentSession = await this.authSessionRepo.getSession();
        if (currentSession) {
            const newSession = currentSession.updateTokens(
                result.accessToken,
                result.refreshToken,
                isoToExpiresInSeconds(result.refreshTokenExpiry)
            );
            await this.authSessionRepo.saveSession(newSession);
        }

        return result;
    }

    private isSuccess(r: IRefreshTokenResponse | IRefreshTokenResponseError): r is IRefreshTokenResponse {
        return 'accessToken' in r && 'refreshToken' in r;
    }
}
