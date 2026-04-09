/**
 * INFRASTRUCTURE LAYER - UserService
 * Implementación de IUserService que conecta con el API de usuario.
 */

import type {
  IHttpClient,
  UserProfileResponse,
  UpdateUserProfileRequest,
  ProblemDetails,
} from '../../Domain'
import type { IUserService } from '../../Application/Services/User/IUserService'

export class UserService implements IUserService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/users'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getProfile(): Promise<UserProfileResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        UserProfileResponse | ProblemDetails
      >(`${this.baseUrl}/me`, { cacheTtl: 10 * 60 * 1000 })
      if (response.status === 200) return response.data as UserProfileResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateProfile(
    request: UpdateUserProfileRequest
  ): Promise<UserProfileResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.put<
        UserProfileResponse | ProblemDetails
      >(`${this.baseUrl}/me`, request)
      if (response.status === 200) {
        this.httpClient.invalidateCache(`${this.baseUrl}/me`)
        return response.data as UserProfileResponse
      }
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
