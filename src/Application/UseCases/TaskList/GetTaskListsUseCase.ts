import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IGetTaskListsRequest,
  IGetTaskListsResponse,
} from '../../../Domain/TaskList'

export type GetTaskListsOutput =
  | { success: true; taskLists: IGetTaskListsResponse['taskLists'] }
  | { success: false; error: ApiErrorResponse }

export class GetTaskListsUseCase implements IUseCase<
  IGetTaskListsRequest,
  GetTaskListsOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: IGetTaskListsRequest): Promise<GetTaskListsOutput> {
    const result = await this.taskListService.getTaskLists(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, taskLists: result.taskLists }
  }

  private isError(
    result: IGetTaskListsResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
