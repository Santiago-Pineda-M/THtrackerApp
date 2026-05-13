import type { IUseCase, ApiTaskListsTypes } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type { IAuthSessionRepository } from '../../../Domain'

export type CreateTaskListRequest = ApiTaskListsTypes['CreateTaskListCommand']
export type ProblemDetails = ApiTaskListsTypes['ProblemDetails']
export type CreateTaskListResponse = ApiTaskListsTypes['TaskListResponse']

export class CreateTaskListUseCase implements IUseCase<
  CreateTaskListRequest,
  CreateTaskListResponse | ProblemDetails
> {
  private readonly taskListService: ITaskListService
  private readonly authSessionRepository: IAuthSessionRepository

  constructor(
    taskListService: ITaskListService,
    authSessionRepository: IAuthSessionRepository
  ) {
    this.taskListService = taskListService
    this.authSessionRepository = authSessionRepository
  }

  async execute(
    request: CreateTaskListRequest
  ): Promise<CreateTaskListResponse | ProblemDetails> {
    const session = await this.authSessionRepository.getSession()
    if (!session) {
      throw new Error('No session found')
    }
    request.userId = session.userId
    const result = await this.taskListService.createTaskList(request)
    return result
  }
}
