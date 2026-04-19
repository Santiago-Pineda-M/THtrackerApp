import { Ploc } from '../../Domain/Ploc'
import type { ITaskDeleteState } from '../../Domain'
import type { DeleteTaskUseCase } from '../../Application/UseCases/TaskList/DeleteTaskUseCase'

export class TaskDeletePloc extends Ploc<ITaskDeleteState> {
  private readonly deleteTaskUseCase: DeleteTaskUseCase

  constructor(deleteTaskUseCase: DeleteTaskUseCase) {
    super({ kind: 'idle' })
    this.deleteTaskUseCase = deleteTaskUseCase
  }

  async deleteTask(id: string): Promise<void> {
    this.changeState({ kind: 'deleting' })

    const result = await this.deleteTaskUseCase.execute({ id })

    if (result.success) {
      this.changeState({ kind: 'deleteSuccess' })
      return
    }

    this.changeState({
      kind: 'deleteError',
      error: result.error.detail || 'Error deleting task',
    })
  }
}
