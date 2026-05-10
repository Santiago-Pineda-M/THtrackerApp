import type { IUseCase, ApiTasksTypes } from '../../../Domain'
import type { ITaskService } from '../../Services/Task/ITaskService'

type ICreateTaskRequest = ApiTasksTypes['CreateTaskCommand']
type ICreateTaskResponse = ApiTasksTypes['TaskResponse']
type ApiErrorResponse = ApiTasksTypes['ProblemDetails']

export type CreateTaskOutput = ICreateTaskResponse | ApiErrorResponse

export class CreateTaskUseCase implements IUseCase<
  ICreateTaskRequest,
  CreateTaskOutput
> {
  private readonly taskService: ITaskService

  constructor(taskService: ITaskService) {
    this.taskService = taskService
  }

  async execute(request: ICreateTaskRequest): Promise<CreateTaskOutput> {
    const result = await this.taskService.createTask(request)
    return result
  }
}
