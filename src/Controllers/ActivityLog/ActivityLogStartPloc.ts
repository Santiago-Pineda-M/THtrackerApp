import {
  Ploc,
  initialActivityLogStartState,
  type IActivityLogStartState,
} from '../../Domain'
import type {
  StartActivityLogUseCase,
  ActivityLogResponse,
  ProblemDetails,
} from '../../Application/UseCases/ActivityLog/StartActivityLogUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

/**
 * CONTROLLER LAYER - PLOC para gestionar el inicio de registros de actividad
 * Cumple con SRP al enfocarse únicamente en la acción de "Start".
 */
export class ActivityLogStartPloc extends Ploc<IActivityLogStartState> {
  private readonly startActivityLogUseCase: StartActivityLogUseCase

  constructor(startActivityLogUseCase: StartActivityLogUseCase) {
    super(initialActivityLogStartState)
    this.startActivityLogUseCase = startActivityLogUseCase
  }

  /**
   * Inicia un nuevo registro para una actividad específica
   * @param activityId UUID de la actividad
   */
  async startLog(activityId: string) {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
      success: false,
      newLog: null,
    })

    try {
      const result = await this.startActivityLogUseCase.execute({ activityId })

      if (this.isStartLogSuccess(result)) {
        this.changeState({
          ...this.state,
          isLoading: false,
          success: true,
          newLog: result,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        errors: mappedErrors,
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

  private isStartLogSuccess(
    result: ActivityLogResponse | ProblemDetails
  ): result is ActivityLogResponse {
    return 'id' in result && 'activityId' in result
  }

  /**
   * Limpia el estado del PLOC
   */
  reset() {
    this.changeState(initialActivityLogStartState)
  }
}
