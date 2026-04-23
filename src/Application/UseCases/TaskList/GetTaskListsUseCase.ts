import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IGetTaskListsRequest,
  IGetTaskListsResponse,
} from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

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
    if (isApiError(result)) return { success: false, error: result }
    return { success: true, taskLists: result.taskLists }
  }
}
