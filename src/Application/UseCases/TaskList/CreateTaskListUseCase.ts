import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'

type CreateTaskListRequest = ApiTaskListsTypes['CreateTaskListCommand']
type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
type CreateTaskListResponse = ApiTaskListsTypes['TaskListResponse']

export type CreateTaskListOutput = CreateTaskListResponse | ProblemDetails

export class CreateTaskListUseCase implements IUseCase<
  CreateTaskListRequest,
  CreateTaskListOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: CreateTaskListRequest): Promise<CreateTaskListOutput> {
    const result = await this.taskListService.createTaskList(request)
    return result
  }
}
