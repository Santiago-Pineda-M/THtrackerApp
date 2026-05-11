import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

export type ToggleTaskResponse = ApiTasksTypes['TaskResponse']
export type ProblemDetails = ApiTasksTypes['ProblemDetails']
export type ToggleTaskPath = ApiTasksTypes['ToggleTaskPath']

export class ToggleTaskUseCase implements IUseCase<
  ToggleTaskPath,
  ToggleTaskResponse | ProblemDetails
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(
    request: ToggleTaskPath
  ): Promise<ToggleTaskResponse | ProblemDetails> {
    const result = await this.taskService.toggleTask(request)
    return result
  }
}
