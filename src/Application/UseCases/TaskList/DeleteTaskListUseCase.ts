import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

export type DeleteTaskListRequest = ApiTaskListsTypes['TaskListIdPath']
export type ProblemDetails = ApiTaskListsTypes['ProblemDetails']

export class DeleteTaskListUseCase implements IUseCase<
  DeleteTaskListRequest,
  void | ProblemDetails
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: DeleteTaskListRequest
  ): Promise<void | ProblemDetails> {
    const result = await this.taskListService.deleteTaskList(request)
    return result
  }
}
