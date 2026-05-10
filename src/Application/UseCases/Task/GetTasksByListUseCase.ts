import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

type TaskPaginatedResponse = ApiTasksTypes['TaskResponsePaginated']
type ProblemDetails = ApiTasksTypes['ProblemDetails']

type GetTasksByListRequest = ApiTasksTypes['TaskByListPath']

export type GetTasksByListOutput = TaskPaginatedResponse | ProblemDetails

export class GetTasksByListUseCase implements IUseCase<
  GetTasksByListRequest,
  GetTasksByListOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: GetTasksByListRequest): Promise<GetTasksByListOutput> {
    const result = await this.taskService.getTasksByList(request)
    return result
  }
}
