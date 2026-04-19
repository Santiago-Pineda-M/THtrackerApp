import { Ploc } from '../../Domain/Ploc'
import type { ITaskListDeleteState } from '../../Domain'
import type { DeleteTaskListUseCase } from '../../Application/UseCases/TaskList/DeleteTaskListUseCase'

export class TaskListDeletePloc extends Ploc<ITaskListDeleteState> {
  private readonly deleteTaskListUseCase: DeleteTaskListUseCase

  constructor(deleteTaskListUseCase: DeleteTaskListUseCase) {
    super({ kind: 'idle' })
    this.deleteTaskListUseCase = deleteTaskListUseCase
  }

  async deleteTaskList(id: string): Promise<void> {
    this.changeState({ kind: 'deleting' })

    const result = await this.deleteTaskListUseCase.execute({ id })

    if (result.success) {
      this.changeState({ kind: 'deleteSuccess' })
      return
    }

    this.changeState({
      kind: 'deleteError',
      error: result.error.detail || 'Error deleting task list',
    })
  }
}
