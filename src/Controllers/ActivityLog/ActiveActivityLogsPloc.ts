import { Ploc, initialActiveActivityLogsState } from '../../Domain'
import type { IActiveActivityLogsState } from '../../Domain'
import type {
  GetActiveActivityLogsUseCase,
  ActivityLogResponsePaginated,
  ProblemDetails,
} from '../../Application/UseCases/ActivityLog/GetActiveActivityLogsUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

/**
 * CONTROLLER LAYER - PLOC para gestionar la lista global de logs activos
 */
export class ActiveActivityLogsPloc extends Ploc<IActiveActivityLogsState> {
  private readonly getActiveActivityLogsUseCase: GetActiveActivityLogsUseCase

  constructor(getActiveActivityLogsUseCase: GetActiveActivityLogsUseCase) {
    super(initialActiveActivityLogsState)
    this.getActiveActivityLogsUseCase = getActiveActivityLogsUseCase
  }

  /**
   * Carga todos los registros de actividad que están actualmente en curso
   */
  async loadActiveLogs() {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getActiveActivityLogsUseCase.execute({})

      if (this.isActiveActivityLogsSuccess(result)) {
        this.changeState({
          ...this.state,
          logs: result,
          isLoading: false,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        logs: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        logs: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  private isActiveActivityLogsSuccess(
    result: ActivityLogResponsePaginated | ProblemDetails
  ): result is ActivityLogResponsePaginated {
    return 'items' in result
  }

  /**
   * Limpia el estado del PLOC
   */
  reset() {
    this.changeState(initialActiveActivityLogsState)
  }
}
