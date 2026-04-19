import { Ploc } from '../../Domain/Ploc'
import type { ITasksState } from '../../Domain'
import type { GetTasksByListUseCase } from '../../Application/UseCases/TaskList/GetTasksByListUseCase'

export class TasksPloc extends Ploc<ITasksState> {
  private readonly getTasksByListUseCase: GetTasksByListUseCase

  constructor(getTasksByListUseCase: GetTasksByListUseCase) {
    super({ kind: 'initial' })
    this.getTasksByListUseCase = getTasksByListUseCase
  }

  async loadTasks(taskListId: string): Promise<void> {
    this.changeState({ kind: 'loading' })

    const result = await this.getTasksByListUseCase.execute({ taskListId })

    if (result.success) {
      if (result.tasks.length === 0) {
        this.changeState({ kind: 'empty' })
      } else {
        this.changeState({ kind: 'loadSuccess', tasks: result.tasks })
      }
      return
    }

    this.changeState({
      kind: 'loadError',
      error: result.error.detail || 'Error loading tasks',
    })
  }
}
