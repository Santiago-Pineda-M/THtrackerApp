import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IUpdateTaskRequest,
  IUpdateTaskResponse,
} from '../../../Domain/TaskList'

export type UpdateTaskOutput =
  | { success: true; task: IUpdateTaskResponse['task'] }
  | { success: false; error: ApiErrorResponse }

export class UpdateTaskUseCase implements IUseCase<IUpdateTaskRequest, UpdateTaskOutput> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: IUpdateTaskRequest): Promise<UpdateTaskOutput> {
    const result = await this.taskListService.updateTask(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, task: result.task }
  }

  private isError(
    result: IUpdateTaskResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
