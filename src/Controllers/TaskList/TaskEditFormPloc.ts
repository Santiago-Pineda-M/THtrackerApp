import { Ploc } from '../../Domain/Ploc'
import type { ITaskEditState } from '../../Domain'
import type { GetTaskByIdUseCase } from '../../Application/UseCases/TaskList/GetTaskByIdUseCase'
import type { UpdateTaskUseCase } from '../../Application/UseCases/TaskList/UpdateTaskUseCase'
import type { IUpdateTaskRequest } from '../../Domain/TaskList'

export class TaskEditFormPloc extends Ploc<ITaskEditState> {
  private readonly getTaskByIdUseCase: GetTaskByIdUseCase
  private readonly updateTaskUseCase: UpdateTaskUseCase

  constructor(
    getTaskByIdUseCase: GetTaskByIdUseCase,
    updateTaskUseCase: UpdateTaskUseCase
  ) {
    super({ kind: 'idle' })
    this.getTaskByIdUseCase = getTaskByIdUseCase
    this.updateTaskUseCase = updateTaskUseCase
  }

  async loadForEdit(id: string): Promise<void> {
    this.changeState({ kind: 'loading' })

    const result = await this.getTaskByIdUseCase.execute({ id })

    if (result.success) {
      this.changeState({ kind: 'loadSuccess', task: result.task })
      return
    }

    this.changeState({
      kind: 'loadError',
      error: result.error.detail || 'Error loading task',
    })
  }

  async submitEdit(request: IUpdateTaskRequest): Promise<void> {
    this.changeState({ kind: 'submitting' })

    const result = await this.updateTaskUseCase.execute(request)

    if (result.success) {
      this.changeState({ kind: 'submitSuccess', task: result.task })
      return
    }

    this.changeState({
      kind: 'submitError',
      error: result.error.detail || 'Error updating task',
    })
  }
}
