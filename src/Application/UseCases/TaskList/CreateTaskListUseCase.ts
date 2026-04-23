import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  ICreateTaskListRequest,
  ICreateTaskListResponse,
} from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

export type CreateTaskListOutput =
  | { success: true; taskList: ICreateTaskListResponse['taskList'] }
  | { success: false; error: ApiErrorResponse }

export class CreateTaskListUseCase implements IUseCase<
  ICreateTaskListRequest,
  CreateTaskListOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: ICreateTaskListRequest
  ): Promise<CreateTaskListOutput> {
    const result = await this.taskListService.createTaskList(request)
    if (isApiError(result)) return { success: false, error: result }
    return { success: true, taskList: result.taskList }
  }
}
