import { Ploc } from '../../Domain/Ploc'
import type { ITaskListDetailState } from '../../Domain'
import type { GetTaskListByIdUseCase } from '../../Application/UseCases/TaskList/GetTaskListByIdUseCase'

export class TaskListDetailPloc extends Ploc<ITaskListDetailState> {
  private readonly getTaskListByIdUseCase: GetTaskListByIdUseCase

  constructor(getTaskListByIdUseCase: GetTaskListByIdUseCase) {
    super({ kind: 'initial' })
    this.getTaskListByIdUseCase = getTaskListByIdUseCase
  }

  async loadTaskList(id: string): Promise<void> {
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
}
