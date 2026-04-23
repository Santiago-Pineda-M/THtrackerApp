import type { IHttpClient, ApiErrorResponse } from '../../../Domain'
import type { ITaskService } from './ITaskService'
import type {
  IGetTasksByListRequest,
  IGetTaskByIdRequest,
  ICreateTaskRequest,
  IUpdateTaskRequest,
  IDeleteTaskRequest,
  IToggleTaskRequest,
  IGetTasksByListResponse,
  IGetTaskByIdResponse,
  ICreateTaskResponse,
  IUpdateTaskResponse,
  IDeleteTaskResponse,
  IToggleTaskResponse,
  ITaskItem,
} from '../../../Domain/TaskList'

export class TaskService implements ITaskService {
  private readonly httpClient: IHttpClient
  private readonly baseTaskUrl = '/api/v1/tasks'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getTasksByList(
    r: IGetTasksByListRequest
  ): Promise<IGetTasksByListResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        ITaskItem[] | ApiErrorResponse
      >(`${this.baseTaskUrl}/by-task-list/${r.taskListId}`)
      if (response.status === 200)
        return { tasks: response.data as ITaskItem[] }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getTaskById(
    r: IGetTaskByIdRequest
  ): Promise<IGetTaskByIdResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<ITaskItem | ApiErrorResponse>(
        `${this.baseTaskUrl}/${r.id}`
      )
      if (response.status === 200) return { task: response.data as ITaskItem }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createTask(
    r: ICreateTaskRequest
  ): Promise<ICreateTaskResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.post<ITaskItem | ApiErrorResponse>(
        this.baseTaskUrl,
        r
      )
      if (response.status === 201) {
        this.httpClient.invalidateCache(
          `${this.baseTaskUrl}/by-task-list/${r.taskListId}`
        )
        return { task: response.data as ITaskItem }
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateTask(
    r: IUpdateTaskRequest
  ): Promise<IUpdateTaskResponse | ApiErrorResponse> {
    const { id, taskListId, ...data } = r
    try {
      const response = await this.httpClient.put<ITaskItem | ApiErrorResponse>(
        `${this.baseTaskUrl}/${id}`,
        data
      )
      if (response.status === 200) {
        // Invalidar la caché de la lista a la que pertenece la tarea
        this.httpClient.invalidateCache(
          `${this.baseTaskUrl}/by-task-list/${taskListId}`
        )
        return { task: response.data as ITaskItem }
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteTask(
    r: IDeleteTaskRequest
  ): Promise<IDeleteTaskResponse | ApiErrorResponse> {
    const { id, taskListId } = r
    try {
      const response = await this.httpClient.delete<void | ApiErrorResponse>(
        `${this.baseTaskUrl}/${id}`
      )
      if (response.status === 204) {
        // Invalidar la caché de la lista a la que pertenecía la tarea
        this.httpClient.invalidateCache(
          `${this.baseTaskUrl}/by-task-list/${taskListId}`
        )
        return { success: true }
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async toggleTask(
    r: IToggleTaskRequest
  ): Promise<IToggleTaskResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.patch<void | ApiErrorResponse>(
        `${this.baseTaskUrl}/${r.id}/toggle`,
        {}
      )
      if (response.status === 204) {
        return { success: true }
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  private toNetworkError(error: unknown): ApiErrorResponse {
    return {
      title: 'Network Error',
      detail: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    }
  }
}
