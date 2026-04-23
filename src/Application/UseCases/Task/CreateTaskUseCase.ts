import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'
import type {
  ICreateTaskRequest,
  ICreateTaskResponse,
} from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

export type CreateTaskOutput =
  | { success: true; task: ICreateTaskResponse['task'] }
  | { success: false; error: ApiErrorResponse }

export class CreateTaskUseCase implements IUseCase<
  ICreateTaskRequest,
  CreateTaskOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: ICreateTaskRequest): Promise<CreateTaskOutput> {
    const result = await this.taskService.createTask(request)
    if (isApiError(result)) return { success: false, error: result }
    return { success: true, task: result.task }
  }
}
