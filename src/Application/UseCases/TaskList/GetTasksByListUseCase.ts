import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IGetTasksByListRequest,
  IGetTasksByListResponse,
} from '../../../Domain/TaskList'

export type GetTasksByListOutput =
  | { success: true; tasks: IGetTasksByListResponse['tasks'] }
  | { success: false; error: ApiErrorResponse }

export class GetTasksByListUseCase implements IUseCase<
  IGetTasksByListRequest,
  GetTasksByListOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: IGetTasksByListRequest
  ): Promise<GetTasksByListOutput> {
    const result = await this.taskListService.getTasksByList(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, tasks: result.tasks }
  }

  private isError(
    result: IGetTasksByListResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
