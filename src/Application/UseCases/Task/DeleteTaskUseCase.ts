import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

export type DeleteTaskRequest = ApiTasksTypes['TaskIdPath']
export type ProblemDetails = ApiTasksTypes['ProblemDetails']

export class DeleteTaskUseCase implements IUseCase<
  DeleteTaskRequest,
  void | ProblemDetails
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: DeleteTaskRequest): Promise<void | ProblemDetails> {
    const result = await this.taskService.deleteTask(request)
    return result
  }
}
