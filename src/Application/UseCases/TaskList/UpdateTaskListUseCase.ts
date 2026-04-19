import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IUpdateTaskListRequest,
  IUpdateTaskListResponse,
} from '../../../Domain/TaskList'

export type UpdateTaskListOutput =
  | { success: true; taskList: IUpdateTaskListResponse['taskList'] }
  | { success: false; error: ApiErrorResponse }

export class UpdateTaskListUseCase implements IUseCase<
  IUpdateTaskListRequest,
  UpdateTaskListOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: IUpdateTaskListRequest
  ): Promise<UpdateTaskListOutput> {
    const result = await this.taskListService.updateTaskList(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, taskList: result.taskList }
  }

  private isError(
    result: IUpdateTaskListResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
