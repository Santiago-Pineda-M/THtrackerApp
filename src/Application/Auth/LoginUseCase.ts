import type { IUseCase } from "../../Domain/Interfaces/IUseCase";
import type { IHttpClient } from "../../Domain/Interfaces/IHttpClient";
import type { IAuthToken } from "../../Domain/Auth/AuthEntities";
import type { LoginRequest, TokenResponse } from "./AuthDTOs";

/**
 * APPLICATION LAYER - LoginUseCase
 * Realiza la petición de login y devuelve el token de acceso.
 */
export class LoginUseCase implements IUseCase<LoginRequest, IAuthToken> {
    private readonly httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    async execute(request: LoginRequest): Promise<IAuthToken> {
        const response = await this.httpClient.post<TokenResponse>(
            '/api/v1/auth/login',
            request
        );

        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            expiry: new Date(response.data.refreshTokenExpiry)
        };
    }
}
