import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

export type UpdateTaskResponse = ApiTasksTypes['TaskResponse']
export type ProblemDetails = ApiTasksTypes['ProblemDetails']
export type UpdateTaskRequest = ApiTasksTypes['UpdateTaskCommand']
export type TaskIdPath = ApiTasksTypes['TaskIdPath']

export class UpdateTaskUseCase implements IUseCase<
  UpdateTaskRequest,
  UpdateTaskResponse | ProblemDetails
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(
    request: UpdateTaskRequest
  ): Promise<UpdateTaskResponse | ProblemDetails> {
    const path: TaskIdPath = { id: request.id! }
    const result = await this.taskService.updateTask(path, request)
    return result
  }
}
