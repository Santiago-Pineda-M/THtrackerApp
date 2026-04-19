import { Ploc } from '../../Domain/Ploc'
import type { ITaskListsState } from '../../Domain'
import type { GetTaskListsUseCase } from '../../Application/UseCases/TaskList/GetTaskListsUseCase'

export class TaskListsPloc extends Ploc<ITaskListsState> {
  private readonly getTaskListsUseCase: GetTaskListsUseCase

  constructor(getTaskListsUseCase: GetTaskListsUseCase) {
    super({ kind: 'initial' })
    this.getTaskListsUseCase = getTaskListsUseCase
  }

  async loadTaskLists(): Promise<void> {
    this.changeState({ kind: 'loading' })

    const result = await this.getTaskListsUseCase.execute({})

    if (result.success) {
      if (result.taskLists.length === 0) {
        this.changeState({ kind: 'empty' })
      } else {
        this.changeState({ kind: 'loadSuccess', taskLists: result.taskLists })
      }
      return
    }

    this.changeState({
      kind: 'loadError',
      error: result.error.detail || 'Error loading task lists',
    })
  }
}
