import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type {
  ICreateTaskRequest,
  ICreateTaskResponse,
} from '../../../Domain/TaskList'

export type CreateTaskOutput =
  | { success: true; task: ICreateTaskResponse['task'] }
  | { success: false; error: ApiErrorResponse }

export class CreateTaskUseCase implements IUseCase<ICreateTaskRequest, CreateTaskOutput> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(request: ICreateTaskRequest): Promise<CreateTaskOutput> {
    const result = await this.taskListService.createTask(request)

    if (this.isError(result)) {
      return { success: false, error: result }
    }

    return { success: true, task: result.task }
  }

  private isError(
    result: ICreateTaskResponse | ApiErrorResponse
  ): result is ApiErrorResponse {
    return 'title' in result || 'detail' in result || 'status' in result
  }
}
