import { Ploc } from '../../Domain/Ploc'
import type { ITaskListEditState } from '../../Domain'
import type { GetTaskListByIdUseCase } from '../../Application/UseCases/TaskList/GetTaskListByIdUseCase'
import type { UpdateTaskListUseCase } from '../../Application/UseCases/TaskList/UpdateTaskListUseCase'
import type { IUpdateTaskListRequest } from '../../Domain/TaskList'

export class TaskListEditFormPloc extends Ploc<ITaskListEditState> {
  private readonly getTaskListByIdUseCase: GetTaskListByIdUseCase
  private readonly updateTaskListUseCase: UpdateTaskListUseCase

  constructor(
    getTaskListByIdUseCase: GetTaskListByIdUseCase,
    updateTaskListUseCase: UpdateTaskListUseCase
  ) {
    super({ kind: 'idle' })
    this.getTaskListByIdUseCase = getTaskListByIdUseCase
    this.updateTaskListUseCase = updateTaskListUseCase
  }

  async loadForEdit(id: string): Promise<void> {
    this.changeState({ kind: 'loading' })

    const result = await this.getTaskListByIdUseCase.execute({ id })

    if (result.success) {
      this.changeState({ kind: 'loadSuccess', taskList: result.taskList })
      return
    }

    this.changeState({
      kind: 'loadError',
      error: result.error.detail || 'Error loading task list',
    })
  }

  async submitEdit(request: IUpdateTaskListRequest): Promise<void> {
    this.changeState({ kind: 'submitting' })

    const result = await this.updateTaskListUseCase.execute(request)

    if (result.success) {
      this.changeState({ kind: 'submitSuccess', taskList: result.taskList })
      return
    }

    this.changeState({
      kind: 'submitError',
      error: result.error.detail || 'Error updating task list',
    })
  }
}
