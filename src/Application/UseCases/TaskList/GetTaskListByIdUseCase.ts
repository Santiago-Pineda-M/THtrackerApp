import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IGetTaskListByIdRequest,
  IGetTaskListByIdResponse,
} from '../../../Domain/TaskList'

export type GetTaskListByIdOutput =
  | { success: true; taskList: IGetTaskListByIdResponse['taskList'] }
  | { success: false; error: ApiErrorResponse }

export class GetTaskListByIdUseCase implements IUseCase<
  IGetTaskListByIdRequest,
  GetTaskListByIdOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: IGetTaskListByIdRequest
  ): Promise<GetTaskListByIdOutput> {
    const result = await this.taskListService.getTaskListById(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, taskList: result.taskList }
  }

  private isError(
    result: IGetTaskListByIdResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
