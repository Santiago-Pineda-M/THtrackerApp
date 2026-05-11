import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

export type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
export type TaskListResponse = ApiTaskListsTypes['TaskListResponse']
export type GetTaskListByIdRequest = ApiTaskListsTypes['TaskListIdPath']

export class GetTaskListByIdUseCase implements IUseCase<
  GetTaskListByIdRequest,
  TaskListResponse | ProblemDetails
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: GetTaskListByIdRequest
  ): Promise<TaskListResponse | ProblemDetails> {
    const result = await this.taskListService.getTaskListById(request)
    return result
  }
}
