import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

export type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
export type GetTaskListsRequest = ApiTaskListsTypes['GetTaskListsRequest']
export type GetTaskListsResponse =
  ApiTaskListsTypes['TaskListResponsePaginated']

export class GetTaskListsUseCase implements IUseCase<
  GetTaskListsRequest,
  GetTaskListsResponse | ProblemDetails
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: GetTaskListsRequest
  ): Promise<GetTaskListsResponse | ProblemDetails> {
    const result = await this.taskListService.getTaskLists(request)

    return result
  }
}
