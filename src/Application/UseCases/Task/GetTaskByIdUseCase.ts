import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

export type TaskResponse = ApiTasksTypes['TaskResponse']
export type ProblemDetails = ApiTasksTypes['ProblemDetails']
export type GetTaskByIdRequest = ApiTasksTypes['TaskIdPath']

export class GetTaskByIdUseCase implements IUseCase<
  GetTaskByIdRequest,
  TaskResponse | ProblemDetails
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(
    request: GetTaskByIdRequest
  ): Promise<TaskResponse | ProblemDetails> {
    const result = await this.taskService.getTaskById(request)
    return result
  }
}
