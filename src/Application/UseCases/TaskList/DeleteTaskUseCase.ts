import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  IDeleteTaskRequest,
  IDeleteTaskResponse,
} from '../../../Domain/TaskList'

export type DeleteTaskOutput =
  | { success: true }
  | { success: false; error: ApiErrorResponse }

export class DeleteTaskUseCase implements IUseCase<IDeleteTaskRequest, DeleteTaskOutput> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: IDeleteTaskRequest): Promise<DeleteTaskOutput> {
    const result = await this.taskListService.deleteTask(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true }
  }

  private isError(
    result: IDeleteTaskResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
