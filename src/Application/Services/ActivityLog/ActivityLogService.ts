import type { IHttpClient } from '../../../Domain'
import type { IActivityLogService } from './IActivityLogService'
import type { ApiActivityLogsTypes } from '../../../Domain'
type ProblemDetails = ApiActivityLogsTypes['ProblemDetails']
type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']
type ActivityLogResponsePaginated =
  ApiActivityLogsTypes['ActivityLogResponsePaginated']
type StartActivityCommand = ApiActivityLogsTypes['StartActivityCommand']
type UpdateActivityLogCommand = ApiActivityLogsTypes['UpdateActivityLogCommand']
type SaveLogValuesCommand = ApiActivityLogsTypes['SaveLogValuesCommand']
type LogValueResponsePaginated =
  ApiActivityLogsTypes['LogValueResponsePaginated']
type GetActivityLogsParams = ApiActivityLogsTypes['GetActivityLogsParams']
type GetActivityLogIdParams = ApiActivityLogsTypes['GetActivityLogIdParams']
type UpdateActivityLogParams = ApiActivityLogsTypes['UpdateActivityLogParams']
type StopActivityLogParams = ApiActivityLogsTypes['StopActivityLogParams']
type SaveActivityLogValuesParams =
  ApiActivityLogsTypes['SaveActivityLogValuesParams']
type GetActivityLogValuesParams =
  ApiActivityLogsTypes['GetActivityLogValuesParams']
type GetActiveActivityLogsFilters =
  ApiActivityLogsTypes['GetActiveActivityLogsFilters']

export class ActivityLogService implements IActivityLogService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/activity-logs'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getActivityLogs(
    filters?: GetActivityLogsParams
  ): Promise<ActivityLogResponsePaginated | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        ActivityLogResponsePaginated | ProblemDetails
      >(this.baseUrl, { params: filters })
      if (response.status === 200)
        return response.data as ActivityLogResponsePaginated
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getActivityLogById(
    id: GetActivityLogIdParams
  ): Promise<ActivityLogResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        ActivityLogResponse | ProblemDetails
      >(`${this.baseUrl}/${id.id}`) // ← id.id, no id
      if (response.status === 200) return response.data as ActivityLogResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async startActivityLog(
    request: StartActivityCommand // ← body, no path params
  ): Promise<ActivityLogResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        ActivityLogResponse | ProblemDetails
      >(`${this.baseUrl}/start`, request)
      if (response.status === 201) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as ActivityLogResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async stopActivityLog(
    id: StopActivityLogParams
  ): Promise<ActivityLogResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        ActivityLogResponse | ProblemDetails
      >(`${this.baseUrl}/${id.id}/stop`)
      if (response.status === 200) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as ActivityLogResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateActivityLog(
    id: UpdateActivityLogParams,
    request: UpdateActivityLogCommand
  ): Promise<ActivityLogResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.put<
        ActivityLogResponse | ProblemDetails
      >(`${this.baseUrl}/${id.id}`, request)
      if (response.status === 200) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as ActivityLogResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async saveActivityLogValues(
    id: SaveActivityLogValuesParams,
    requests: SaveLogValuesCommand[]
  ): Promise<void | ProblemDetails> {
    try {
      const response = await this.httpClient.post<void | ProblemDetails>(
        `${this.baseUrl}/${id.id}/values`,
        requests
      )
      if (response.status === 204) return
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getActivityLogValues(
    id: GetActivityLogValuesParams
  ): Promise<LogValueResponsePaginated | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        LogValueResponsePaginated | ProblemDetails
      >(`${this.baseUrl}/${id.id}/values`)
      if (response.status === 200)
        return response.data as LogValueResponsePaginated
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getActiveActivityLogs(
    filters: GetActiveActivityLogsFilters
  ): Promise<ActivityLogResponsePaginated | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        ActivityLogResponsePaginated | ProblemDetails
      >(`${this.baseUrl}/active`, { params: filters })
      if (response.status === 200)
        return response.data as ActivityLogResponsePaginated
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
