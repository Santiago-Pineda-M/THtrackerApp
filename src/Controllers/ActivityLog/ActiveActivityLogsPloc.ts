import { Ploc, initialActiveActivityLogsState } from '../../Domain'
import type { IActiveActivityLogsState } from '../../Domain'
import type { GetActiveActivityLogsUseCase } from '../../Application/UseCases/ActivityLog'

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
      error: null,
    })

    const result = await this.getActiveActivityLogsUseCase.execute()

    if (result.success) {
      this.changeState({
        ...this.state,
        logs: result.logs,
        isLoading: false,
      })
    } else {
      this.changeState({
        ...this.state,
        error: result.error,
        isLoading: false,
      })
    }
  }

  /**
   * Limpia el estado del PLOC
   */
  reset() {
    this.changeState(initialActiveActivityLogsState)
  }
}
