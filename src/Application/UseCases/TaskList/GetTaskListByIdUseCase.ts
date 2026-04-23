import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IGetTaskListByIdRequest,
  IGetTaskListByIdResponse,
} from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

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
    if (isApiError(result)) return { success: false, error: result }
    return { success: true, taskList: result.taskList }
  }
}
