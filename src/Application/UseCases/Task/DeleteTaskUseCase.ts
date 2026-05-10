import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

type DeleteTaskRequest = ApiTasksTypes['TaskIdPath']

type ProblemDetails = ApiTasksTypes['ProblemDetails']

type DeleteTaskOutput = void | ProblemDetails

export class DeleteTaskUseCase implements IUseCase<
  DeleteTaskRequest,
  DeleteTaskOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: DeleteTaskRequest): Promise<DeleteTaskOutput> {
    const result = await this.taskService.deleteTask(request)
    return result
  }
}
