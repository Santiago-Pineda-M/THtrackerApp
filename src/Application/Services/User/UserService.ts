import type { IHttpClient, ApiUserTypes } from '../../../Domain'

type UserResponse = ApiUserTypes['UserResponse']
type UpdateUserCommand = ApiUserTypes['UpdateUserCommand']
type ProblemDetails = ApiUserTypes['ProblemDetails']

import type { IUserService } from './IUserService'

export class UserService implements IUserService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/users'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getProfile(): Promise<UserResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.get<UserResponse | ProblemDetails>(
        `${this.baseUrl}/me`,
        { cacheTtl: 10 * 60 * 1000 }
      )
      if (response.status === 200) return response.data as UserResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateProfile(
    request: UpdateUserCommand
  ): Promise<UserResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.put<UserResponse | ProblemDetails>(
        `${this.baseUrl}/me`,
        request
      )
      if (response.status === 200) {
        this.httpClient.invalidateCache(`${this.baseUrl}/me`)
        return response.data as UserResponse
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
