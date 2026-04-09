import { Ploc, initialActivityLogStartState } from '../../Domain'
import type { IActivityLogStartState } from '../../Domain'
import type { StartActivityLogUseCase } from '../../Application/UseCases/ActivityLog'

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
      error: null,
      success: false,
      newLog: null,
    })

    const result = await this.startActivityLogUseCase.execute({ activityId })

    if (result.success) {
      this.changeState({
        ...this.state,
        isLoading: false,
        success: true,
        newLog: result.log,
      })
    } else {
      this.changeState({
        ...this.state,
        isLoading: false,
        error: result.error,
      })
    }
  }

  /**
   * Limpia el estado del PLOC
   */
  reset() {
    this.changeState(initialActivityLogStartState)
  }
}
