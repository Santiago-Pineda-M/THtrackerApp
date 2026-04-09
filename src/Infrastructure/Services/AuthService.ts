/**
 * INFRASTRUCTURE LAYER - AuthService
 * Implementación de IAuthService que conecta con el API de autenticación.
 * Solo implementa los 3 endpoints que existen realmente en la API.
 */

import type {
  IHttpClient,
  ILoginRequest,
  IRegisterRequest,
  IRefreshTokenRequest,
  ILoginResponse,
  IRegisterResponse,
  IRefreshTokenResponse,
  ILoginResponseError,
  IRefreshTokenResponseError,
  IProblemDetails,
} from '../../Domain'
import type { IAuthService } from '../../Application/Services/Auth/IAuthService'

export class AuthService implements IAuthService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/auth'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async login(
    request: ILoginRequest
  ): Promise<ILoginResponse | ILoginResponseError> {
    try {
      const response = await this.httpClient.post<
        ILoginResponse | IProblemDetails
      >(`${this.baseUrl}/login`, request)
      if (response.status === 200) return response.data as ILoginResponse
      return this.toLoginError(response.data)
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async register(
    request: IRegisterRequest
  ): Promise<IRegisterResponse | ILoginResponseError> {
    try {
      const response = await this.httpClient.post<
        IRegisterResponse | IProblemDetails
      >(`${this.baseUrl}/register`, request)
      if (response.status === 200 || response.status === 201)
        return response.data as IRegisterResponse
      return this.toLoginError(response.data)
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async refreshToken(
    request: IRefreshTokenRequest
  ): Promise<IRefreshTokenResponse | IRefreshTokenResponseError> {
    try {
      const response = await this.httpClient.post<
        IRefreshTokenResponse | IProblemDetails
      >(`${this.baseUrl}/refresh`, request)
      if (response.status === 200) return response.data as IRefreshTokenResponse
      return this.toRefreshError(response.data)
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  private toLoginError(data: unknown): ILoginResponseError {
    const p = data as IProblemDetails
    return {
      title: p?.title ?? 'Error',
      status: p?.status ?? 401,
      detail: p?.detail,
      errors: p?.errors,
      type: p?.type,
    }
  }

  private toRefreshError(data: unknown): IRefreshTokenResponseError {
    const p = data as IProblemDetails
    return {
      title: p?.title ?? 'Refresh Error',
      status: p?.status ?? 401,
      detail: p?.detail,
      type: p?.type,
    }
  }

  private toNetworkError(error: unknown): ILoginResponseError {
    return {
      title: 'Network Error',
      status: 0,
      detail: error instanceof Error ? error.message : 'Error de conexión',
    }
  }
}
