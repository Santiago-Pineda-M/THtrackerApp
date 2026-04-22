import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IGetTaskByIdRequest,
  IGetTaskByIdResponse,
} from '../../../Domain/TaskList'

export type GetTaskByIdOutput =
  | { success: true; task: IGetTaskByIdResponse['task'] }
  | { success: false; error: ApiErrorResponse }

export class GetTaskByIdUseCase implements IUseCase<
  IGetTaskByIdRequest,
  GetTaskByIdOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: IGetTaskByIdRequest): Promise<GetTaskByIdOutput> {
    const result = await this.taskListService.getTaskById(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, task: result.task }
  }

  private isError(
    result: IGetTaskByIdResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
