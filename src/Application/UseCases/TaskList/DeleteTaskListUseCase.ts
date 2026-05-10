import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

type DeleteTaskListRequest = ApiTaskListsTypes['TaskListIdPath']
type ProblemDetails = ApiTaskListsTypes['ProblemDetails']

export type DeleteTaskListOutput = void | ProblemDetails

export class DeleteTaskListUseCase implements IUseCase<
  DeleteTaskListRequest,
  DeleteTaskListOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: DeleteTaskListRequest): Promise<DeleteTaskListOutput> {
    const result = await this.taskListService.deleteTaskList(request)
    return result
  }
}
