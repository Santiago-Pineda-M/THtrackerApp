import type { IUseCase, ApiErrorResponse } from '../../../Domain'
import type { ITaskListService } from '../../Services/TaskList/ITaskListService'
import type { IDeleteTaskListRequest } from '../../../Domain/TaskList'
import { isApiError } from '../../../Domain'

export type DeleteTaskListOutput =
  | { success: true }
  | { success: false; error: ApiErrorResponse }

export class DeleteTaskListUseCase implements IUseCase<
  IDeleteTaskListRequest,
  DeleteTaskListOutput
> {
  private readonly taskListService: ITaskListService

  constructor(taskListService: ITaskListService) {
    this.taskListService = taskListService
  }

  async execute(
    request: IDeleteTaskListRequest
  ): Promise<DeleteTaskListOutput> {
    const result = await this.taskListService.deleteTaskList(request)
    if (isApiError(result)) return { success: false, error: result }
    return { success: true }
  }
}
