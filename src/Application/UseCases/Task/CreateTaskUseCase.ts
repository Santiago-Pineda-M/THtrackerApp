import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

export type CreateTaskCommand = ApiTasksTypes['CreateTaskCommand']

export type TaskResponse = ApiTasksTypes['TaskResponse']
export type ProblemDetails = ApiTasksTypes['ProblemDetails']

export class CreateTaskUseCase implements IUseCase<
  CreateTaskCommand,
  TaskResponse | ProblemDetails
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(
    request: CreateTaskCommand
  ): Promise<TaskResponse | ProblemDetails> {
    const result = await this.taskService.createTask(request)
    return result
  }
}
