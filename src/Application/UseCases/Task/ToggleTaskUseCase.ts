import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'
import type { IToggleTaskRequest } from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

export type ToggleTaskOutput =
  | { success: true }
  | { success: false; error: ApiErrorResponse }

export class ToggleTaskUseCase implements IUseCase<
  IToggleTaskRequest,
  ToggleTaskOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: IToggleTaskRequest): Promise<ToggleTaskOutput> {
    const result = await this.taskService.toggleTask(request)
    if (isApiError(result)) return { success: false, error: result }
    return { success: true }
  }
}
