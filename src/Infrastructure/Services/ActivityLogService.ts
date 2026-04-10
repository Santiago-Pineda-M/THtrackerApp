/**
 * INFRASTRUCTURE LAYER - Implementación del servicio de ActivityLogs
 */

import type { IHttpClient } from '../../Domain/IPatterns'
import type {
  ActivityLogResponse,
  StartActivityLogRequest,
  UpdateActivityLogRequest,
  LogValueRequest,
  LogValueResponse,
  IGetActivityLogsRequest,
  ApiErrorResponse,
} from '../../Domain'
import type { IActivityLogService } from '../../Application/Services/ActivityLog/IActivityLogService'

export class ActivityLogService implements IActivityLogService {
  private readonly httpClient: IHttpClient
  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getActivityLogs(
    request?: IGetActivityLogsRequest
  ): Promise<ActivityLogResponse[] | ApiErrorResponse> {
    try {
      const params = new URLSearchParams()

      if (request?.activityId) {
        params.append('ActivityId', request.activityId)
      }
      if (request?.startDate) {
        params.append('StartDate', request.startDate)
      }
      if (request?.endDate) {
        params.append('EndDate', request.endDate)
      }

      const queryString = params.toString()
      const url = queryString
        ? `/api/v1/activity-logs?${queryString}`
        : '/api/v1/activity-logs'

      const response = await this.httpClient.get<ActivityLogResponse[]>(url)
      return response.data
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async getActivityLogById(
    id: string
  ): Promise<ActivityLogResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<ActivityLogResponse>(
        `/api/v1/activity-logs/${id}`
      )
      return response.data
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async startActivityLog(
    request: StartActivityLogRequest
  ): Promise<ActivityLogResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.post<ActivityLogResponse>(
        '/api/v1/activity-logs/start',
        request
      )
      if (response.status === 201) {
        this.httpClient.invalidateCache('/api/v1/activity-logs')
      }
      return response.data
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async stopActivityLog(
    id: string
  ): Promise<ActivityLogResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.post<ActivityLogResponse>(
        `/api/v1/activity-logs/${id}/stop`
      )
      if (response.status === 200) {
        this.httpClient.invalidateCache('/api/v1/activity-logs')
      }
      return response.data
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async updateActivityLog(
    id: string,
    request: UpdateActivityLogRequest
  ): Promise<ActivityLogResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.put<ActivityLogResponse>(
        `/api/v1/activity-logs/${id}`,
        request
      )
      if (response.status === 200) {
        this.httpClient.invalidateCache('/api/v1/activity-logs')
      }
      return response.data
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async saveActivityLogValues(
    id: string,
    requests: LogValueRequest[]
  ): Promise<void | ApiErrorResponse> {
    try {
      await this.httpClient.post<void>(
        `/api/v1/activity-logs/${id}/values`,
        requests
      )
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async getActivityLogValues(
    id: string
  ): Promise<LogValueResponse[] | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<LogValueResponse[]>(
        `/api/v1/activity-logs/${id}/values`
      )
      return response.data
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async getActiveActivityLogs(): Promise<
    ActivityLogResponse[] | ApiErrorResponse
  > {
    try {
      const response = await this.httpClient.get<ActivityLogResponse[]>(
        '/api/v1/activity-logs/active'
      )
      return response.data
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  private handleError(error: unknown): ApiErrorResponse {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response
    ) {
      return error.response.data as ApiErrorResponse
    }
    return {
      title: 'Error de red o de servidor',
      status: 500,
      detail:
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error inesperado al conectar con el servidor',
    } as ApiErrorResponse
  }
}
