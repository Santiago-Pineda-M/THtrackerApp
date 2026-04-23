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
} from '../../../Domain/TaskList'
import type { ApiErrorResponse } from '../../../Domain'

export interface ITaskListService {
  getTaskLists(
    r: IGetTaskListsRequest
  ): Promise<IGetTaskListsResponse | ApiErrorResponse>
  getTaskListById(
    r: IGetTaskListByIdRequest
  ): Promise<IGetTaskListByIdResponse | ApiErrorResponse>
  createTaskList(
    r: ICreateTaskListRequest
  ): Promise<ICreateTaskListResponse | ApiErrorResponse>
  updateTaskList(
    r: IUpdateTaskListRequest
  ): Promise<IUpdateTaskListResponse | ApiErrorResponse>
  deleteTaskList(
    r: IDeleteTaskListRequest
  ): Promise<IDeleteTaskListResponse | ApiErrorResponse>
}
