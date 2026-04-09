import { Ploc, initialActivityLogStopState } from '../../Domain'
import type {
  IActivityLogStopState,
  ActivityLogResponse,
  LogValueRequest,
} from '../../Domain'
import type {
  StopActivityLogUseCase,
  SaveActivityLogValuesUseCase,
} from '../../Application/UseCases/ActivityLog'
import type { GetListActivityValueDefinitionUseCase } from '../../Application/UseCases/ActivityValueDefinition'

/**
 * CONTROLLER LAYER - PLOC para gestionar el cierre de registros de actividad
 * Cumple con SRP al enfocarse únicamente en el flujo de "Stop".
 */
export class ActivityLogStopPloc extends Ploc<IActivityLogStopState> {
  private readonly stopActivityLogUseCase: StopActivityLogUseCase
  private readonly getDefinitionsUseCase: GetListActivityValueDefinitionUseCase
  private readonly saveValuesUseCase: SaveActivityLogValuesUseCase

  constructor(
    stopActivityLogUseCase: StopActivityLogUseCase,
    getDefinitionsUseCase: GetListActivityValueDefinitionUseCase,
    saveValuesUseCase: SaveActivityLogValuesUseCase
  ) {
    super(initialActivityLogStopState)
    this.stopActivityLogUseCase = stopActivityLogUseCase
    this.getDefinitionsUseCase = getDefinitionsUseCase
    this.saveValuesUseCase = saveValuesUseCase
  }

  /**
   * Prepara el cierre de un log cargando sus definiciones de valor
   * @param log El registro que se desea detener
   */
  async prepareStop(log: ActivityLogResponse) {
    this.changeState({
      ...this.state,
      logToStop: log,
      isLoadingDefinitions: true,
      error: null,
      success: false,
    })

    const result = await this.getDefinitionsUseCase.execute({
      activityId: log.activityId,
    })

    if (result.success) {
      this.changeState({
        ...this.state,
        definitions: result.definitions,
        isLoadingDefinitions: false,
      })
    } else {
      this.changeState({
        ...this.state,
        isLoadingDefinitions: false,
        error: result.error,
      })
    }
  }

  /**
   * Detiene el log y guarda los valores proporcionados
   * @param logId ID del log
   * @param values Lista de valores a registrar
   */
  async stopAndSaveValues(logId: string, values: LogValueRequest[]) {
    this.changeState({
      ...this.state,
      isStopping: true,
      error: null,
    })

    // 1. Detener el log en la API
    const stopResult = await this.stopActivityLogUseCase.execute({ logId })

    if (!stopResult.success) {
      this.changeState({
        ...this.state,
        isStopping: false,
        error: stopResult.error,
      })
      return
    }

    // 2. Si se proporcionaron valores, guardarlos
    if (values.length > 0) {
      const saveResult = await this.saveValuesUseCase.execute({
        id: logId,
        requests: values,
      })

      if (!saveResult.success) {
        this.changeState({
          ...this.state,
          isStopping: false,
          error: saveResult.error,
        })
        return
      }
    }

    // Éxito total
    this.changeState({
      ...this.state,
      isStopping: false,
      success: true,
      logToStop: stopResult.log, // El log actualizado con su endedAt
    })
  }

  /**
   * Cancela el proceso de stop y limpia el estado
   */
  cancelStop() {
    this.changeState(initialActivityLogStopState)
  }

  reset() {
    this.changeState(initialActivityLogStopState)
  }
}
