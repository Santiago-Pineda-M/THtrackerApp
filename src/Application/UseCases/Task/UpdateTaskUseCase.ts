import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'
import type {
  IUpdateTaskRequest,
  IUpdateTaskResponse,
} from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

export type UpdateTaskOutput =
  | { success: true; task: IUpdateTaskResponse['task'] }
  | { success: false; error: ApiErrorResponse }

export class UpdateTaskUseCase implements IUseCase<
  IUpdateTaskRequest,
  UpdateTaskOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: IUpdateTaskRequest): Promise<UpdateTaskOutput> {
    const result = await this.taskService.updateTask(request)
    if (isApiError(result)) return { success: false, error: result }
    return { success: true, task: result.task }
  }
}
