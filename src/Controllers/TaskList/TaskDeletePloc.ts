import { Ploc } from '../../Domain/Ploc'
import { type ITaskDeleteState, initialTaskDeleteState } from '../../Domain'
import type {
  DeleteTaskUseCase,
  DeleteTaskRequest,
} from '../../Application/UseCases/Task/DeleteTaskUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class TaskDeletePloc extends Ploc<ITaskDeleteState> {
  private readonly deleteTaskUseCase: DeleteTaskUseCase

  constructor(deleteTaskUseCase: DeleteTaskUseCase) {
    super(initialTaskDeleteState)
    this.deleteTaskUseCase = deleteTaskUseCase
  }

  /**
   * Elimina una tarea por su ID.
   */
  async deleteTask(DeleteTaskRequest: DeleteTaskRequest): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      success: false,
      errors: {},
    })

    try {
      const result = await this.deleteTaskUseCase.execute(DeleteTaskRequest)

      // En el nuevo patrón, la eliminación exitosa devuelve void (undefined)
      if (!result) {
        this.changeState({
          ...this.state,
          isLoading: false,
          success: true,
        })
        return
      }

      // Si hay respuesta, es un ProblemDetails (error)
      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        errors: mappedErrors,
        // Opcional: puedes almacenar un mensaje resumen (requiere que el estado tenga `message`)
        // message: result.title || 'Error al eliminar la tarea.',
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        errors: { general: [message] },
      })
    }
  }

  reset(): void {
    this.changeState(initialTaskDeleteState)
  }
}
