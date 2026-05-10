import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

type TaskResponse = ApiTasksTypes['TaskResponse']
type ProblemDetails = ApiTasksTypes['ProblemDetails']
type GetTaskByIdRequest = ApiTasksTypes['TaskIdPath']

export type GetTaskByIdOutput = TaskResponse | ProblemDetails

export class GetTaskByIdUseCase implements IUseCase<
  GetTaskByIdRequest,
  GetTaskByIdOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: GetTaskByIdRequest): Promise<GetTaskByIdOutput> {
    const result = await this.taskService.getTaskById(request)
    return result
  }
}
