import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
type GetTaskListsResponse = ApiTaskListsTypes['TaskListResponsePaginated']
type GetTaskListsRequest = ApiTaskListsTypes['GetTaskListsRequest']

export type GetTaskListsOutput = GetTaskListsResponse | ProblemDetails

export class GetTaskListsUseCase implements IUseCase<
  GetTaskListsRequest,
  GetTaskListsOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: GetTaskListsRequest): Promise<GetTaskListsOutput> {
    const result = await this.taskListService.getTaskLists(request)

    return result
  }
}
