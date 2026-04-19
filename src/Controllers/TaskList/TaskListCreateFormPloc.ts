import { Ploc } from '../../Domain/Ploc'
import type { ITaskListCreateState } from '../../Domain'
import type { CreateTaskListUseCase } from '../../Application/UseCases/TaskList/CreateTaskListUseCase'
import type { ICreateTaskListRequest } from '../../Domain/TaskList'

export class TaskListCreateFormPloc extends Ploc<ITaskListCreateState> {
  private readonly createTaskListUseCase: CreateTaskListUseCase

  constructor(createTaskListUseCase: CreateTaskListUseCase) {
    super({ kind: 'idle' })
    this.createTaskListUseCase = createTaskListUseCase
  }

  async submitCreate(request: ICreateTaskListRequest): Promise<void> {
    this.changeState({ kind: 'submitting' })

    const result = await this.createTaskListUseCase.execute(request)

    if (result.success) {
      this.changeState({ kind: 'submitSuccess', taskList: result.taskList })
      return
    }

    this.changeState({
      kind: 'submitError',
      error: result.error.detail || 'Error creating task list',
    })
  }
}
