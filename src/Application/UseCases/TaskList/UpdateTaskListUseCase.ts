import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

export type UpdateTaskListRequest = ApiTaskListsTypes['UpdateTaskListCommand']
export type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
export type UpdateTaskListResponse = ApiTaskListsTypes['TaskListResponse']
export type UpdateTaskListParams = ApiTaskListsTypes['TaskListIdPath']

export class UpdateTaskListUseCase implements IUseCase<
  UpdateTaskListRequest,
  UpdateTaskListResponse | ProblemDetails
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: UpdateTaskListRequest
  ): Promise<UpdateTaskListResponse | ProblemDetails> {
    const params: UpdateTaskListParams = {
      id: request.id!,
    }
    const result = await this.taskListService.updateTaskList(params, request)
    return result
  }
}
