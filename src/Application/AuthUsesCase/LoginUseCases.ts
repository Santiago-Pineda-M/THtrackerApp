/**
 * APPLICATION LAYER - LoginUserUseCase
 * Caso de uso de login que delega en IAuthService y en éxito persiste usando el repositorio.
 * Este es el UseCase principal de login según la documentación.
 */

import type { IUseCase } from '../../Domain';
import type { IAuthService, ILoginService, ITokenService } from '../Interfaces/IServices/IAuthService';
import type { IAuthSessionRepository } from '../../Domain';
import { AuthSession } from '../../Domain/Entities/AuthSession';
import { AuthTokens } from '../../Domain/ValueObjects';
import type { ILoginRequest, IRefreshTokenRequest } from '../../Domain/Request/IAuthRequest';
import type { ILoginResponse, IRefreshTokenResponse } from '../../Domain/Responses/IAuthResponses';
import type { ILoginResponseError } from '../../Domain/Responses/IAuthResponsesError';

/**
 * JWT Payload Decoded
 */
interface JwtPayload {
    sub?: string;
    email?: string;
    name?: string;
    exp?: number;
    iat?: number;
}

/**
 * Output del caso de uso.
 */
export type LoginOutput = ILoginResponse | ILoginResponseError;

/**
 * Caso de uso para iniciar sesión.
 * Valida credenciales, crea la sesión y la persiste.
 */
export class LoginUserUseCase implements IUseCase<ILoginRequest, LoginOutput> {
    private readonly authService: IAuthService | ILoginService;
    private readonly authSessionRepo: IAuthSessionRepository;

    constructor(authService: IAuthService | ILoginService, authSessionRepo: IAuthSessionRepository) {
        this.authService = authService;
        this.authSessionRepo = authSessionRepo;
    }

    async execute(input: ILoginRequest): Promise<LoginOutput> {
        const result = await this.authService.login(input);

        if (this.isLoginSuccess(result)) {
            // 1. Decodificar JWT para obtener info del usuario
            const claims = this.decodeJwtPayload(result.accessToken);

            // 2. Validar que tenemos los datos mínimos necesarios
            const userId = claims.sub;
            const userEmail = claims.email ?? input.email;
            
            if (!userId || userId.trim() === '') {
                return {
                    title: 'Authentication Error',
                    status: 500,
                    detail: 'Token de autenticación inválido: falta identificación de usuario'
                };
            }

            const tokens = AuthTokens.createWithExpiry(
                result.accessToken,
                result.refreshToken,
                result.expiresIn || 3600
            );
            
            const session = AuthSession.create({
                tokens,
                user: { 
                    id: userId, 
                    email: userEmail,
                    name: claims.name 
                }
            });

            // 3. Persistir a través del repositorio
            await this.authSessionRepo.saveSession(session);
        }

        return result;
    }

    private isLoginSuccess(result: ILoginResponse | ILoginResponseError): result is ILoginResponse {
        return 'accessToken' in result && 'refreshToken' in result;
    }

    private decodeJwtPayload(token: string): JwtPayload {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return {};
            
            // Decode Base64URL to Base64
            let base64 = parts[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            
            // Add padding if needed
            const padding = base64.length % 4;
            if (padding) {
                base64 += '='.repeat(4 - padding);
            }
            
            const decoded = atob(base64);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Error decoding JWT payload:', error);
            return {};
        }
    }
}

/**
 * Caso de uso que renueva tokens y actualiza la sesión.
 */
export class RefreshTokenUseCases implements IUseCase<IRefreshTokenRequest, IRefreshTokenResponse | ILoginResponseError> {
    private readonly authService: IAuthService | ITokenService;
    private readonly authSessionRepo: IAuthSessionRepository;

    constructor(authService: IAuthService | ITokenService, authSessionRepo: IAuthSessionRepository) {
        this.authService = authService;
        this.authSessionRepo = authSessionRepo;
    }

    async execute(input: IRefreshTokenRequest): Promise<IRefreshTokenResponse | ILoginResponseError> {
        const result = await this.authService.refreshToken(input);

        if (this.isRefreshTokenSuccess(result)) {
            // Mantener datos existentes del usuario al actualizar tokens
            const currentSession = await this.authSessionRepo.getSession();
            if (currentSession) {
                const newSession = currentSession.updateTokens(
                    result.accessToken,
                    result.refreshToken,
                    result.expiresIn
                );
                await this.authSessionRepo.saveSession(newSession);
            }
        }

        return result;
    }

    private isRefreshTokenSuccess(result: IRefreshTokenResponse | ILoginResponseError): result is IRefreshTokenResponse {
        return 'accessToken' in result && 'refreshToken' in result;
    }
}
