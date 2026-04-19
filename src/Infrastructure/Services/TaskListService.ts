import type { IHttpClient, ApiErrorResponse } from '../../Domain'
import type { ITaskListService } from '../../Application/Services/TaskList/ITaskListService'
import type {
  IGetTaskListByIdRequest,
  ICreateTaskListRequest,
  IUpdateTaskListRequest,
  IDeleteTaskListRequest,
  IGetTasksByListRequest,
  IGetTaskByIdRequest,
  ICreateTaskRequest,
  IUpdateTaskRequest,
  IDeleteTaskRequest,
  IToggleTaskRequest,
  IGetTaskListsResponse,
  IGetTaskListByIdResponse,
  ICreateTaskListResponse,
  IUpdateTaskListResponse,
  IDeleteTaskListResponse,
  IGetTasksByListResponse,
  IGetTaskByIdResponse,
  ICreateTaskResponse,
  IUpdateTaskResponse,
  IDeleteTaskResponse,
  IToggleTaskResponse,
  ITaskListItem,
  ITaskItem,
} from '../../Domain/TaskList'

export class TaskListService implements ITaskListService {
  private readonly httpClient: IHttpClient
  private readonly baseTaskListUrl = '/api/v1/task-lists'
  private readonly baseTaskUrl = '/api/v1/tasks'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getTaskLists(): Promise<IGetTaskListsResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        ITaskListItem[] | ApiErrorResponse
      >(this.baseTaskListUrl)
      if (response.status === 200)
        return { taskLists: response.data as ITaskListItem[] }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async getTaskListById(
    r: IGetTaskListByIdRequest
  ): Promise<IGetTaskListByIdResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.get<
        ITaskListItem | ApiErrorResponse
      >(`${this.baseTaskListUrl}/${r.id}`)
      if (response.status === 200)
        return { taskList: response.data as ITaskListItem }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async createTaskList(
    r: ICreateTaskListRequest
  ): Promise<ICreateTaskListResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.post<
        ITaskListItem | ApiErrorResponse
      >(this.baseTaskListUrl, r)
      if (response.status === 201) {
        this.httpClient.invalidateCache(this.baseTaskListUrl)
        return { taskList: response.data as ITaskListItem }
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async updateTaskList(
    r: IUpdateTaskListRequest
  ): Promise<IUpdateTaskListResponse | ApiErrorResponse> {
    const { id, ...data } = r
    try {
      const response = await this.httpClient.put<
        ITaskListItem | ApiErrorResponse
      >(`${this.baseTaskListUrl}/${id}`, data)
      if (response.status === 200) {
        this.httpClient.invalidateCache(this.baseTaskListUrl)
        return { taskList: response.data as ITaskListItem }
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
  }

  async deleteTaskList(
    r: IDeleteTaskListRequest
  ): Promise<IDeleteTaskListResponse | ApiErrorResponse> {
    try {
      const response = await this.httpClient.delete<void | ApiErrorResponse>(
        `${this.baseTaskListUrl}/${r.id}`
      )
      if (response.status === 204) {
        this.httpClient.invalidateCache(this.baseTaskListUrl)
        return { success: true }
      }
      return response.data as ApiErrorResponse
    } catch (error) {
      return this.toNetworkError(error)
    }
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
    const { id, ...data } = r
    try {
      const response = await this.httpClient.put<ITaskItem | ApiErrorResponse>(
        `${this.baseTaskUrl}/${id}`,
        data
      )
      if (response.status === 200) {
        // We don't have taskListId here to invalidate cache, but usually updating a task
        // should invalidate the list it belongs to if the client doesn't know.
        // For simplicity, we assume the client will handle it or we could invalidate all task caches.
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
    try {
      const response = await this.httpClient.delete<void | ApiErrorResponse>(
        `${this.baseTaskUrl}/${r.id}`
      )
      if (response.status === 204) {
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
