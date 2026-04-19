import type {
  IGetTaskListsRequest,
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
  getTasksByList(
    r: IGetTasksByListRequest
  ): Promise<IGetTasksByListResponse | ApiErrorResponse>
  getTaskById(
    r: IGetTaskByIdRequest
  ): Promise<IGetTaskByIdResponse | ApiErrorResponse>
  createTask(
    r: ICreateTaskRequest
  ): Promise<ICreateTaskResponse | ApiErrorResponse>
  updateTask(
    r: IUpdateTaskRequest
  ): Promise<IUpdateTaskResponse | ApiErrorResponse>
  deleteTask(
    r: IDeleteTaskRequest
  ): Promise<IDeleteTaskResponse | ApiErrorResponse>
  toggleTask(
    r: IToggleTaskRequest
  ): Promise<IToggleTaskResponse | ApiErrorResponse>
}
