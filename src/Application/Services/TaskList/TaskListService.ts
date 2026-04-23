import type { IHttpClient, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from './ITaskListService'
import type {
  IGetTaskListsRequest,
  IGetTaskListByIdRequest,
  ICreateTaskListRequest,
  IUpdateTaskListRequest,
  IDeleteTaskListRequest,
  IGetTaskListsResponse,
  IGetTaskListByIdResponse,
  ICreateTaskListResponse,
  IUpdateTaskListResponse,
  IDeleteTaskListResponse,
  ITaskListItem,
} from '../../../Domain/TaskList'

export class TaskListService implements ITaskListService {
  private readonly httpClient: IHttpClient
  private readonly baseTaskListUrl = '/api/v1/task-lists'

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getTaskLists(
    _r: IGetTaskListsRequest
  ): Promise<IGetTaskListsResponse | ApiErrorResponse> {
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

  private toNetworkError(error: unknown): ApiErrorResponse {
    return {
      title: 'Network Error',
      detail: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    }
  }
}
