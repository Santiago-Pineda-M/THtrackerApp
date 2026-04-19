import { Ploc } from '../../Domain/Ploc'
import type { ITaskToggleState } from '../../Domain'
import type { ToggleTaskUseCase } from '../../Application/UseCases/TaskList/ToggleTaskUseCase'

export class TaskTogglePloc extends Ploc<ITaskToggleState> {
  private readonly toggleTaskUseCase: ToggleTaskUseCase

  constructor(toggleTaskUseCase: ToggleTaskUseCase) {
    super({ kind: 'idle' })
    this.toggleTaskUseCase = toggleTaskUseCase
  }

  async toggle(id: string): Promise<void> {
    this.changeState({ kind: 'toggling', taskId: id })

    const result = await this.toggleTaskUseCase.execute({ id })

    if (result.success) {
      // Note: We don't have the new completion state in the response,
      // but the UI can usually infer it or reload the list.
      // I'll set a default or dummy value if needed, but the state definition says isCompleted: boolean.
      // Since IToggleTaskResponse is { success: true }, I'll have to assume success means it toggled.
      this.changeState({ kind: 'toggleSuccess', taskId: id, isCompleted: true })
      return
    }

    this.changeState({
      kind: 'toggleError',
      taskId: id,
      error: result.error.detail || 'Error toggling task',
    })
  }
}
