/**
 * INFRASTRUCTURE LAYER - AuthService
 * Implementación de IAuthService que conecta los Use Cases con el HTTP Client.
 * Maneja la comunicación con el API de autenticación.
 */

import type { IHttpClient } from '../../Domain/Interfaces/IHttpClient';
import type {
    IAuthService,
    ILoginService,
    ITokenService,
    IRegistrationService,
    IPasswordService
} from '../../Application/Interfaces/IServices/IAuthService';

import type {
    ILoginRequest,
    IRegisterRequest,
    IRefreshTokenRequest,
    IConfirmEmailRequest,
    IResendEmailConfirmationRequest,
    IForgotPasswordRequest,
    IResetPasswordRequest,
} from '../../Domain/Request/IAuthRequest';

import type {
    ILoginResponse,
    IRegisterResponse,
    IRefreshTokenResponse,
    IConfirmEmailResponse,
    IResendEmailConfirmationResponse,
    IForgotPasswordResponse,
    IResetPasswordResponse,
} from '../../Domain/Responses/IAuthResponses';

import type {
    ILoginResponseError,
    IRefreshTokenResponseError,
} from '../../Domain/Responses/IAuthResponsesError';

/**
 * Implementación de AuthService que conecta con el API.
 * Maneja errores según RFC 7807 (ProblemDetails).
 */
export class AuthService implements IAuthService, ILoginService, ITokenService, IRegistrationService, IPasswordService {
    private readonly httpClient: IHttpClient;
    private readonly baseUrl: string;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
        this.baseUrl = '/api/v1/auth';
    }

    // ─────────────────────────────────────────────────────────────
    // ILoginService
    // ─────────────────────────────────────────────────────────────

    async login(request: ILoginRequest): Promise<ILoginResponse | ILoginResponseError> {
        try {
            const response = await this.httpClient.post<ILoginResponse | ProblemDetails>(
                `${this.baseUrl}/login`,
                request
            );

            if (response.status === 200) {
                return response.data as ILoginResponse;
            }

            return this.mapToLoginError(response.data);
        } catch (error) {
            return this.mapErrorToLoginResponse(error);
        }
    }

    async logout(): Promise<void> {
        try {
            await this.httpClient.post(`${this.baseUrl}/logout`, {});
        } catch {
            // Silenciar errores de logout - la sesión local se limpiará de todos modos
        }
    }

    // ─────────────────────────────────────────────────────────────
    // ITokenService
    // ─────────────────────────────────────────────────────────────

    async refreshToken(request: IRefreshTokenRequest): Promise<IRefreshTokenResponse | IRefreshTokenResponseError> {
        try {
            const response = await this.httpClient.post<IRefreshTokenResponse | ProblemDetails>(
                `${this.baseUrl}/refresh`,
                request
            );

            if (response.status === 200) {
                return response.data as IRefreshTokenResponse;
            }

            return this.mapToRefreshError(response.data);
        } catch (error) {
            return this.mapErrorToRefreshResponse(error);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // IRegistrationService
    // ─────────────────────────────────────────────────────────────

    async register(request: IRegisterRequest): Promise<IRegisterResponse | ILoginResponseError> {
        try {
            const response = await this.httpClient.post<IRegisterResponse | ProblemDetails>(
                `${this.baseUrl}/register`,
                request
            );

            if (response.status === 200 || response.status === 201) {
                return response.data as IRegisterResponse;
            }

            return this.mapToLoginError(response.data);
        } catch (error) {
            return this.mapErrorToLoginResponse(error);
        }
    }

    async confirmEmail(request: IConfirmEmailRequest): Promise<IConfirmEmailResponse> {
        const response = await this.httpClient.post<IConfirmEmailResponse | ProblemDetails>(
            `${this.baseUrl}/confirm-email`,
            request
        );

        if (response.status !== 200) {
            const errorData = response.data as ProblemDetails;
            throw new Error(errorData?.detail || errorData?.title || 'Error al confirmar email');
        }

        return response.data as IConfirmEmailResponse;
    }

    async resendConfirmationEmail(request: IResendEmailConfirmationRequest): Promise<IResendEmailConfirmationResponse> {
        const response = await this.httpClient.post<IResendEmailConfirmationResponse | ProblemDetails>(
            `${this.baseUrl}/resend-confirmation`,
            request
        );

        if (response.status !== 200) {
            const errorData = response.data as ProblemDetails;
            throw new Error(errorData?.detail || errorData?.title || 'Error al reenviar confirmación');
        }

        return response.data as IResendEmailConfirmationResponse;
    }

    // ─────────────────────────────────────────────────────────────
    // IPasswordService
    // ─────────────────────────────────────────────────────────────

    async forgotPassword(request: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
        const response = await this.httpClient.post<IForgotPasswordResponse | ProblemDetails>(
            `${this.baseUrl}/forgot-password`,
            request
        );

        if (response.status !== 200) {
            const errorData = response.data as ProblemDetails;
            throw new Error(errorData?.detail || errorData?.title || 'Error al solicitar recuperación');
        }

        return response.data as IForgotPasswordResponse;
    }

    async resetPassword(request: IResetPasswordRequest): Promise<IResetPasswordResponse> {
        const response = await this.httpClient.post<IResetPasswordResponse | ProblemDetails>(
            `${this.baseUrl}/reset-password`,
            request
        );

        if (response.status !== 200) {
            const errorData = response.data as ProblemDetails;
            throw new Error(errorData?.detail || errorData?.title || 'Error al resetear contraseña');
        }

        return response.data as IResetPasswordResponse;
    }

    // ─────────────────────────────────────────────────────────────
    // Métodos privados de mapeo de errores
    // ─────────────────────────────────────────────────────────────

    private mapToLoginError(data: unknown): ILoginResponseError {
        const problem = data as ProblemDetails;
        return {
            title: problem?.title || 'Login Failed',
            status: problem?.status || 401,
            detail: problem?.detail,
            errors: problem?.errors,
            type: problem?.type,
        };
    }

    private mapToRefreshError(data: unknown): IRefreshTokenResponseError {
        const problem = data as ProblemDetails;
        return {
            title: problem?.title || 'Refresh Failed',
            status: problem?.status || 401,
            detail: problem?.detail,
            type: problem?.type,
        };
    }

    private mapErrorToLoginResponse(error: unknown): ILoginResponseError {
        if (error instanceof Error) {
            return {
                title: 'Network Error',
                status: 0,
                detail: error.message || 'Error de conexión',
            };
        }
        return {
            title: 'Unknown Error',
            status: 0,
            detail: 'Error desconocido',
        };
    }

    private mapErrorToRefreshResponse(error: unknown): IRefreshTokenResponseError {
        if (error instanceof Error) {
            return {
                title: 'Network Error',
                status: 0,
                detail: error.message || 'Error de conexión',
            };
        }
        return {
            title: 'Unknown Error',
            status: 0,
            detail: 'Error desconocido',
        };
    }
}

/**
 * RFC 7807 ProblemDetails
 */
interface ProblemDetails {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string[]>;
}
