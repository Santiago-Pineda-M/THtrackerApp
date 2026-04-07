/**
 * INFRASTRUCTURE LAYER - ActivityValueDefinitionService
 * Implementación de IActivityValueDefinitionService que conecta con el API de definiciones de valor.
 */

import type {
  IHttpClient,
  ActivityValueDefinitionResponse,
  CreateValueDefinitionRequest,
  UpdateValueDefinitionRequest,
  ApiErrorResponse,
} from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../../Application/Services/ActivityValueDefinition/IActivityValueDefinitionService'

export class ActivityValueDefinitionService implements IActivityValueDefinitionService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/activities'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getValueDefinitions(
    activityId: string
  ): Promise<ActivityValueDefinitionResponse[] | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        ActivityValueDefinitionResponse[] | ApiErrorResponse
      >(`${this.baseUrl}/${activityId}/definitions`)
      if (response.status === 200)
        return response.data as ActivityValueDefinitionResponse[]
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getValueDefinitionById(
    activityId: string,
    definitionId: string
  ): Promise<ActivityValueDefinitionResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        ActivityValueDefinitionResponse | ApiErrorResponse
      >(`${this.baseUrl}/${activityId}/definitions/${definitionId}`)
      if (response.status === 200)
        return response.data as ActivityValueDefinitionResponse
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createValueDefinition(
    activityId: string,
    request: CreateValueDefinitionRequest
  ): Promise<ActivityValueDefinitionResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.post<
        ActivityValueDefinitionResponse | ApiErrorResponse
      >(`${this.baseUrl}/${activityId}/definitions`, request)
      if (response.status === 201)
        return response.data as ActivityValueDefinitionResponse
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateValueDefinition(
    activityId: string,
    id: string,
    request: UpdateValueDefinitionRequest
  ): Promise<ActivityValueDefinitionResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.put<
        ActivityValueDefinitionResponse | ApiErrorResponse
      >(`${this.baseUrl}/${activityId}/definitions/${id}`, request)
      if (response.status === 200)
        return response.data as ActivityValueDefinitionResponse
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteValueDefinition(
    activityId: string,
    id: string
  ): Promise<void | ApiErrorResponse> {
    try {
      const response = await this.httpClient.delete<boolean | ApiErrorResponse>(
        `${this.baseUrl}/${activityId}/definitions/${id}`
      )
      if (response.status === 204) return
      // El API retorna 200 con "true" para indicar éxito
      if (response.status === 200 && response.data === true) return
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  private toNetworkError(error: unknown): ApiErrorResponse {
    return {
      title: 'Network Error',
      status: 0,
      detail: error instanceof Error ? error.message : 'Error de conexión',
    }
  }
}
