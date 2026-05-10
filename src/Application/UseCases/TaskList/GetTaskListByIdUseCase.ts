import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
type TaskListResponse = ApiTaskListsTypes['TaskListResponse']
type GetTaskListByIdRequest = ApiTaskListsTypes['TaskListIdPath']

export type GetTaskListByIdOutput = TaskListResponse | ProblemDetails

export class GetTaskListByIdUseCase implements IUseCase<
  GetTaskListByIdRequest,
  GetTaskListByIdOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: GetTaskListByIdRequest
  ): Promise<GetTaskListByIdOutput> {
    const result = await this.taskListService.getTaskListById(request)
    return result
  }
}
