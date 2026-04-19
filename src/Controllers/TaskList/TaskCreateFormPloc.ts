import { Ploc } from '../../Domain/Ploc'
import type { ITaskCreateState } from '../../Domain'
import type { CreateTaskUseCase } from '../../Application/UseCases/TaskList/CreateTaskUseCase'
import type { ICreateTaskRequest } from '../../Domain/TaskList'

export class TaskCreateFormPloc extends Ploc<ITaskCreateState> {
  private readonly createTaskUseCase: CreateTaskUseCase

  constructor(createTaskUseCase: CreateTaskUseCase) {
    super({ kind: 'idle' })
    this.createTaskUseCase = createTaskUseCase
  }

  async submitCreate(request: ICreateTaskRequest): Promise<void> {
    this.changeState({ kind: 'submitting' })

    const result = await this.createTaskUseCase.execute(request)

    if (result.success) {
      this.changeState({ kind: 'submitSuccess', task: result.task })
      return
    }

    this.changeState({
      kind: 'submitError',
      error: result.error.detail || 'Error creating task',
    })
  }
}
