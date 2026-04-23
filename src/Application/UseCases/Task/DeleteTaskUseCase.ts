import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'
import type { IDeleteTaskRequest } from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

export type DeleteTaskOutput =
  | { success: true }
  | { success: false; error: ApiErrorResponse }

export class DeleteTaskUseCase implements IUseCase<
  IDeleteTaskRequest,
  DeleteTaskOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: IDeleteTaskRequest): Promise<DeleteTaskOutput> {
    const result = await this.taskService.deleteTask(request)
    if (isApiError(result)) return { success: false, error: result }
    return { success: true }
  }
}
