import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IToggleTaskRequest,
  IToggleTaskResponse,
} from '../../../Domain/TaskList'

export type ToggleTaskOutput =
  | { success: true }
  | { success: false; error: ApiErrorResponse }

export class ToggleTaskUseCase implements IUseCase<
  IToggleTaskRequest,
  ToggleTaskOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: IToggleTaskRequest): Promise<ToggleTaskOutput> {
    const result = await this.taskListService.toggleTask(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true }
  }

  private isError(
    result: IToggleTaskResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
