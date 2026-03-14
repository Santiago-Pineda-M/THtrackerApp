import type { IUseCase } from "../../Domain/Interfaces/IUseCase";
import type { IHttpClient } from "../../Domain/Interfaces/IHttpClient";
import type { IAuthToken } from "../../Domain/Auth/AuthEntities";
import type { RefreshTokenRequest, TokenResponse } from "./AuthDTOs";
import { validateRefreshTokenResponse } from "./HttpResponseValidator";

/**
 * APPLICATION LAYER - RefreshTokenUseCase
 * Renueva el access token usando un refresh token.
 */
export class RefreshTokenUseCase implements IUseCase<string, IAuthToken> {
    private readonly httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    async execute(refreshToken: string): Promise<IAuthToken> {
        const response = await this.httpClient.post<TokenResponse>(
            '/api/v1/auth/refresh',
            { refreshToken } as RefreshTokenRequest
        );

        const data = validateRefreshTokenResponse<TokenResponse>(response);

        return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiry: new Date(data.refreshTokenExpiry)
        };
    }
}
