import type { IHttpClient, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from './ITaskListService'

type TaskListResponse = ApiTaskListsTypes['TaskListResponse']
type TaskListResponsePaginated = ApiTaskListsTypes['TaskListResponsePaginated']
type CreateTaskListRequest = ApiTaskListsTypes['CreateTaskListCommand']
type UpdateTaskListRequest = ApiTaskListsTypes['UpdateTaskListCommand']
type ProblemDetails = ApiTaskListsTypes['ProblemDetails']

type TaskListIdPath = ApiTaskListsTypes['TaskListIdPath']

type GetTaskListsPath = ApiTaskListsTypes['GetTaskListsRequest']

export class TaskListService implements ITaskListService {
  private readonly httpClient: IHttpClient
  private readonly baseUrl = '/api/v1/task-lists'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getTaskLists(
    path: GetTaskListsPath
  ): Promise<TaskListResponsePaginated | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        TaskListResponsePaginated | ProblemDetails
      >(this.baseUrl, {
        params: path,
        cacheTtl: 5 * 60 * 1000,
      })
      if (response.status === 200)
        return response.data as TaskListResponsePaginated
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getTaskListById(
    path: TaskListIdPath
  ): Promise<TaskListResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.get<
        TaskListResponse | ProblemDetails
      >(`${this.baseUrl}`, {
        params: path,
        cacheTtl: 5 * 60 * 1000,
      })
      if (response.status === 200) return response.data as TaskListResponse
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createTaskList(
    request: CreateTaskListRequest
  ): Promise<TaskListResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.post<
        TaskListResponse | ProblemDetails
      >(`${this.baseUrl}`, request)
      if (response.status === 201) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as TaskListResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateTaskList(
    path: TaskListIdPath,
    request: UpdateTaskListRequest
  ): Promise<TaskListResponse | ProblemDetails> {
    try {
      const response = await this.httpClient.put<
        TaskListResponse | ProblemDetails
      >(`${this.baseUrl}/${path.id}`, request)
      if (response.status === 200) {
        this.httpClient.invalidateCache(this.baseUrl)
        return response.data as TaskListResponse
      }
      return response.data as ProblemDetails
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteTaskList(path: TaskListIdPath): Promise<void | ProblemDetails> {
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

  private toNetworkError(error: unknown): ProblemDetails {
    return {
      title: 'Network Error',
      status: 0,
      detail: error instanceof Error ? error.message : 'Error de conexión',
    }
  }
}
