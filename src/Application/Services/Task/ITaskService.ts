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
} from '../../../Domain/TaskList'
import type { ApiErrorResponse } from '../../../Domain'

export interface ITaskService {
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
