import type { IHttpClient, ApiAuthTypes } from '../../../Domain'
import type { IAuthService } from './IAuthService'

type LoginCommand = ApiAuthTypes['LoginCommand']
type RegisterCommand = ApiAuthTypes['RegisterCommand']
type SubmitRefreshToken = ApiAuthTypes['SubmitRefreshToken']
type TokenResponse = ApiAuthTypes['TokenResponse']
type UserResponse = ApiAuthTypes['UserResponse']
type ProblemDetails = ApiAuthTypes['ProblemDetails']

export class AuthService implements IAuthService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/auth'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async login(request: LoginCommand): Promise<TokenResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        TokenResponse | ProblemDetails
      >(`${this.baseUrl}/login`, request)
      if (response.status === 200) return response.data as TokenResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async register(
    request: RegisterCommand
  ): Promise<UserResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        UserResponse | ProblemDetails
      >(`${this.baseUrl}/register`, request)
      if (response.status === 201) return response.data as UserResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async refreshToken(
    request: SubmitRefreshToken
  ): Promise<TokenResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        TokenResponse | ProblemDetails
      >(`${this.baseUrl}/refresh`, request)
      if (response.status === 200) return response.data as TokenResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  private toNetworkError(error: unknown): ProblemDetails {
    return {
      title: 'Network Error',
      status: 0,
      detail: error instanceof Error ? error.message : 'Error de conexión',
    }
  }
}
