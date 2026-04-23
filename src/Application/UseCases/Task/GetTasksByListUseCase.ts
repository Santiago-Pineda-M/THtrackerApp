import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'
import type {
  IGetTasksByListRequest,
  IGetTasksByListResponse,
} from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

export type GetTasksByListOutput =
  | { success: true; tasks: IGetTasksByListResponse['tasks'] }
  | { success: false; error: ApiErrorResponse }

export class GetTasksByListUseCase implements IUseCase<
  IGetTasksByListRequest,
  GetTasksByListOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(
    request: IGetTasksByListRequest
  ): Promise<GetTasksByListOutput> {
    const result = await this.taskService.getTasksByList(request)
    if (isApiError(result)) return { success: false, error: result }
    return { success: true, tasks: result.tasks }
  }
}
