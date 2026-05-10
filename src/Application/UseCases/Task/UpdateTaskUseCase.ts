import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

type UpdateTaskResponse = ApiTasksTypes['TaskResponse']
type ProblemDetails = ApiTasksTypes['ProblemDetails']
type UpdateTaskRequest = ApiTasksTypes['UpdateTaskCommand']
type TaskIdPath = ApiTasksTypes['TaskIdPath']

export type UpdateTaskOutput = UpdateTaskResponse | ProblemDetails

export class UpdateTaskUseCase implements IUseCase<
  UpdateTaskRequest,
  UpdateTaskOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: UpdateTaskRequest): Promise<UpdateTaskOutput> {
    const path: TaskIdPath = { id: request.id! }
    const result = await this.taskService.updateTask(path, request)
    return result
  }
}
