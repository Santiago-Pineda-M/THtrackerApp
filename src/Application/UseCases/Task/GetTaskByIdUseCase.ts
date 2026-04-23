import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'
import type {
  IGetTaskByIdRequest,
  IGetTaskByIdResponse,
} from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

export type GetTaskByIdOutput =
  | { success: true; task: IGetTaskByIdResponse['task'] }
  | { success: false; error: ApiErrorResponse }

export class GetTaskByIdUseCase implements IUseCase<
  IGetTaskByIdRequest,
  GetTaskByIdOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: IGetTaskByIdRequest): Promise<GetTaskByIdOutput> {
    const result = await this.taskService.getTaskById(request)
    if (isApiError(result)) return { success: false, error: result }
    return { success: true, task: result.task }
  }
}
