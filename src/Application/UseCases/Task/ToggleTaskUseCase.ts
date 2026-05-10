import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

type ToggleTaskResponse = ApiTasksTypes['TaskResponse']
type ProblemDetails = ApiTasksTypes['ProblemDetails']

type ToggleTaskPath = ApiTasksTypes['ToggleTaskPath']

type ToggleTaskOutput = ToggleTaskResponse | ProblemDetails

export class ToggleTaskUseCase implements IUseCase<
  ToggleTaskPath,
  ToggleTaskOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: ToggleTaskPath): Promise<ToggleTaskOutput> {
    const result = await this.taskService.toggleTask(request)
    return result
  }
}
