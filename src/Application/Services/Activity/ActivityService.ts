/**
 * INFRASTRUCTURE LAYER - ActivityService
 * Implementación de IActivityService que conecta con el API de actividades.
 */

import type { IHttpClient, ApiActivitiesTypes } from '../../../Domain'
import type { IActivityService } from './IActivityService'

type ActivityResponse = ApiActivitiesTypes['ActivityResponse']
type ActivityResponsePaginated = ApiActivitiesTypes['ActivityPaginatedResponse']
type CreateActivityRequest = ApiActivitiesTypes['CreateActivityCommand']
type UpdateActivityRequest = ApiActivitiesTypes['UpdateActivityCommand']
type ApiErrorResponse = ApiActivitiesTypes['ProblemDetails']

type GetActivitiesFilters = ApiActivitiesTypes['GetActivitiesFilters']
type GetActivityIdPath = ApiActivitiesTypes['GetActivityIdPath']
type DeleteActivityPath = ApiActivitiesTypes['DeleteActivityPath']
type UpdateActivityPath = ApiActivitiesTypes['UpdateActivityPath']

export class ActivityService implements IActivityService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/activities'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getActivities(
    filters: GetActivitiesFilters
  ): Promise<ActivityResponsePaginated | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        ActivityResponsePaginated | ApiErrorResponse
      >(this.baseUrl, { cacheTtl: 5 * 60 * 1000, params: filters })
      if (response.status === 200)
        return response.data as ActivityResponsePaginated
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getActivityById(
    id: GetActivityIdPath
  ): Promise<ActivityResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        ActivityResponse | ApiErrorResponse
      >(`${this.baseUrl}/${id}`, { cacheTtl: 5 * 60 * 1000 })
      if (response.status === 200) return response.data as ActivityResponse
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createActivity(
    request: CreateActivityRequest
  ): Promise<ActivityResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.post<
        ActivityResponse | ApiErrorResponse
      >(this.baseUrl, request)
      if (response.status === 201) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as ActivityResponse
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateActivity(
    id: UpdateActivityPath,
    request: UpdateActivityRequest
  ): Promise<ActivityResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.put<
        ActivityResponse | ApiErrorResponse
      >(`${this.baseUrl}/${id}`, request)
      if (response.status === 200) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as ActivityResponse
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteActivity(
    id: DeleteActivityPath
  ): Promise<void | ApiErrorResponse> {
    try {
      const response = await this.httpClient.delete<void | ApiErrorResponse>(
        `${this.baseUrl}/${id}`
      )
      if (response.status === 204) {
        this.httpClient.invalidateCache(this.baseUrl)
        return
      }
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
