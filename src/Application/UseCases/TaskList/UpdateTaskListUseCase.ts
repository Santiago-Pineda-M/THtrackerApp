import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

type UpdateTaskListRequest = ApiTaskListsTypes['UpdateTaskListCommand']
type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
type UpdateTaskListResponse = ApiTaskListsTypes['TaskListResponse']

type UpdateTaskListParams = ApiTaskListsTypes['TaskListIdPath']

export type UpdateTaskListOutput = UpdateTaskListResponse | ProblemDetails

export class UpdateTaskListUseCase implements IUseCase<
  UpdateTaskListRequest,
  UpdateTaskListOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: UpdateTaskListRequest): Promise<UpdateTaskListOutput> {
    const params: UpdateTaskListParams = {
      id: request.id!,
    }
    const result = await this.taskListService.updateTaskList(params, request)
    return result
  }
}
