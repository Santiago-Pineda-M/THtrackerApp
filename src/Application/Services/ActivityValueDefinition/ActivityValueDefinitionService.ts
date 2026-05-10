/**
 * INFRASTRUCTURE LAYER - ActivityValueDefinitionService
 * Implementación de IActivityValueDefinitionService que conecta con el API de definiciones de valor.
 */

import type {
  IHttpClient,
  ApiActivityValueDefinitionTypes,
} from '../../../Domain'
import type { IActivityValueDefinitionService } from '../../../Application/Services/ActivityValueDefinition/IActivityValueDefinitionService'

type ActivityValueDefinitionResponse =
  ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponse']
type ActivityValueDefinitionResponsePaginated =
  ApiActivityValueDefinitionTypes['ActivityValueDefinitionResponsePaginated']
type CreateValueDefinitionCommand =
  ApiActivityValueDefinitionTypes['CreateValueDefinitionCommand']
type UpdateValueDefinitionCommand =
  ApiActivityValueDefinitionTypes['UpdateValueDefinitionCommand']
type ProblemDetails = ApiActivityValueDefinitionTypes['ProblemDetails']
type DefinitionsPath = ApiActivityValueDefinitionTypes['DefinitionsPath']

type DefinitionFilterPath =
  ApiActivityValueDefinitionTypes['DefinitionFilterPath']

type DefinitionByIdPath = ApiActivityValueDefinitionTypes['DefinitionByIdPath']

export class ActivityValueDefinitionService implements IActivityValueDefinitionService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/activities'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getValueDefinitions(
    path: DefinitionsPath,
    filters: DefinitionFilterPath
  ): Promise<ActivityValueDefinitionResponsePaginated | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        ActivityValueDefinitionResponsePaginated | ProblemDetails
      >(`${this.baseUrl}/${path.activityId}/definitions`, {
        params: filters,
      })
      if (response.status === 200)
        return response.data as ActivityValueDefinitionResponsePaginated
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getValueDefinitionById(
    path: DefinitionByIdPath
  ): Promise<ActivityValueDefinitionResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        ActivityValueDefinitionResponse | ProblemDetails
      >(`${this.baseUrl}/${path.activityId}/definitions/${path.definitionId}`)
      if (response.status === 200)
        return response.data as ActivityValueDefinitionResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createValueDefinition(
    path: DefinitionsPath,
    request: CreateValueDefinitionCommand
  ): Promise<ActivityValueDefinitionResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        ActivityValueDefinitionResponse | ProblemDetails
      >(`${this.baseUrl}/${path.activityId}/definitions`, request)
      if (response.status === 201) {
        this.httpClient.invalidateCache(
          `${this.baseUrl}/${path.activityId}/definitions`
        )
        return response.data as ActivityValueDefinitionResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateValueDefinition(
    path: DefinitionByIdPath,
    request: UpdateValueDefinitionCommand
  ): Promise<ActivityValueDefinitionResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.put<
        ActivityValueDefinitionResponse | ProblemDetails
      >(
        `${this.baseUrl}/${path.activityId}/definitions/${path.definitionId}`,
        request
      )
      if (response.status === 200) {
        this.httpClient.invalidateCache(
          `${this.baseUrl}/${path.activityId}/definitions`
        )
        return response.data as ActivityValueDefinitionResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteValueDefinition(
    path: DefinitionByIdPath
  ): Promise<void | ProblemDetails> {
    try {
      const response = await this.httpClient.delete<void | ProblemDetails>(
        `${this.baseUrl}/${path.activityId}/definitions/${path.definitionId}`
      )
      if (response.status === 204) {
        this.httpClient.invalidateCache(
          `${this.baseUrl}/${path.activityId}/definitions`
        )
        return
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
