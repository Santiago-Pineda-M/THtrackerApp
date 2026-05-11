import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

export type TaskPaginatedResponse = ApiTasksTypes['TaskResponsePaginated']
export type ProblemDetails = ApiTasksTypes['ProblemDetails']
export type GetTasksByListRequest = ApiTasksTypes['TaskByListPath']
export type GetTasksByListQuery = ApiTasksTypes['GetTasksByListQuery']

export class GetTasksByListUseCase implements IUseCase<
  { request: GetTasksByListRequest; query: GetTasksByListQuery },
  TaskPaginatedResponse | ProblemDetails
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute({
    request,
    query,
  }: {
    request: GetTasksByListRequest
    query: GetTasksByListQuery
  }): Promise<TaskPaginatedResponse | ProblemDetails> {
    const result = await this.taskService.getTasksByList(request, query)
    return result
  }
}
