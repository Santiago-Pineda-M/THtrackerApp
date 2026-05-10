import type { IHttpClient, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from './ITaskService'

type TaskResponse = ApiTasksTypes['TaskResponse']
type TaskResponsePaginated = ApiTasksTypes['TaskResponsePaginated']
type CreateTaskRequest = ApiTasksTypes['CreateTaskCommand']
type UpdateTaskRequest = ApiTasksTypes['UpdateTaskCommand']
type ProblemDetails = ApiTasksTypes['ProblemDetails']

type TaskByListPath = ApiTasksTypes['TaskByListPath']
type TaskIdPath = ApiTasksTypes['TaskIdPath']

export class TaskService implements ITaskService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/tasks'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getTasksByList(
    path: TaskByListPath
  ): Promise<TaskResponsePaginated | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        TaskResponsePaginated | ProblemDetails
      >(`${this.baseUrl}/by-task-list/${path.taskListId}`)
      if (response.status === 200) return response.data as TaskResponsePaginated
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getTaskById(path: TaskIdPath): Promise<TaskResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.get<TaskResponse | ProblemDetails>(
        `${this.baseUrl}/${path.id}`
      )
      if (response.status === 200) return response.data as TaskResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createTask(
    request: CreateTaskRequest
  ): Promise<TaskResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        TaskResponse | ProblemDetails
      >(this.baseUrl, request)
      if (response.status === 201) {
        this.httpClient.invalidateCache(
          `${this.baseUrl}/by-task-list/${request.taskListId}`
        )
        return response.data as TaskResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateTask(
    path: TaskIdPath,
    request: UpdateTaskRequest
  ): Promise<TaskResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.put<TaskResponse | ProblemDetails>(
        `${this.baseUrl}/${path.id}`,
        request
      )
      if (response.status === 200) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as TaskResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteTask(path: TaskIdPath): Promise<void | ProblemDetails> {
    try {
      const response = await this.httpClient.delete<void | ProblemDetails>(
        `${this.baseUrl}/${path.id}`
      )
      if (response.status === 204) {
        this.httpClient.invalidateCache(this.baseUrl)
        return
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async toggleTask(path: TaskIdPath): Promise<TaskResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.patch<
        TaskResponse | ProblemDetails
      >(`${this.baseUrl}/${path.id}/toggle`)
      if (response.status === 200) return response.data as TaskResponse
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
