import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

export type CreateTaskListRequest = ApiTaskListsTypes['CreateTaskListCommand']
export type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
export type CreateTaskListResponse = ApiTaskListsTypes['TaskListResponse']

export class CreateTaskListUseCase implements IUseCase<
  CreateTaskListRequest,
  CreateTaskListResponse | ProblemDetails
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: CreateTaskListRequest
  ): Promise<CreateTaskListResponse | ProblemDetails> {
    const result = await this.taskListService.createTaskList(request)
    return result
  }
}
