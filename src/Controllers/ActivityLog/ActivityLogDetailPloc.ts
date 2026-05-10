import { Ploc, initialActivityLogDetailState } from '../../Domain'
import type { IActivityLogDetailState } from '../../Domain'
import {
  GetActivityLogByIdUseCase,
  UpdateActivityLogUseCase,
  SaveActivityLogValuesUseCase,
  GetActivityLogValuesUseCase,
} from '../../Application/UseCases/ActivityLog'

export class ActivityLogDetailPloc extends Ploc<IActivityLogDetailState> {
  private readonly getActivityLogByIdUseCase: GetActivityLogByIdUseCase
  private readonly updateActivityLogUseCase: UpdateActivityLogUseCase
  private readonly saveActivityLogValuesUseCase: SaveActivityLogValuesUseCase
  private readonly getActivityLogValuesUseCase: GetActivityLogValuesUseCase

  constructor(
    getActivityLogByIdUseCase: GetActivityLogByIdUseCase,
    updateActivityLogUseCase: UpdateActivityLogUseCase,
    saveActivityLogValuesUseCase: SaveActivityLogValuesUseCase,
    getActivityLogValuesUseCase: GetActivityLogValuesUseCase
  ) {
    super(initialActivityLogDetailState)
    this.getActivityLogByIdUseCase = getActivityLogByIdUseCase
    this.updateActivityLogUseCase = updateActivityLogUseCase
    this.saveActivityLogValuesUseCase = saveActivityLogValuesUseCase
    this.getActivityLogValuesUseCase = getActivityLogValuesUseCase
  }

  async getLogDetail(id: string) {
    this.changeState({
      ...this.state,
      isLoading: true,
      error: null,
      success: false,
      message: '',
    })

    const result = await this.getActivityLogByIdUseCase.execute({ id })

    this.changeState({
      ...this.state,
      log: result,
      isLoading: false,
      success: true,
      message: 'Registro obtenido exitosamente',
    })
  }

  async updateLog(id: string, startedAt: string, endedAt: string | null) {
    this.changeState({
      ...this.state,
      isLoading: true,
      error: null,
      success: false,
      message: '',
    })

    const result = await this.updateActivityLogUseCase.execute({
      id,
      request: { startedAt, endedAt },
    })

    if (result.success) {
      this.changeState({
        ...this.state,
        log: result.log,
        isLoading: false,
        success: true,
        message: 'Registro de fecha actualizado exitosamente',
      })
    } else {
      this.changeState({
        ...this.state,
        error: result.error,
        isLoading: false,
      })
    }
  }

  async saveValues(id: string, values: LogValueRequest[]) {
    this.changeState({
      ...this.state,
      isLoading: true,
      error: null,
      success: false,
      message: '',
    })

    const result = await this.saveActivityLogValuesUseCase.execute({
      id,
      requests: values,
    })

    if (result.success) {
      // Después de guardar métricas, recargamos el detalle del log para tener sus custom values fresquitos
      await this.getLogDetail(id)
      this.changeState({
        ...this.state,
        success: true,
        message: 'Valores adicionales guardados exitosamente',
      })
    } else {
      this.changeState({
        ...this.state,
        error: result.error,
        isLoading: false,
      })
    }
  }

  async fetchValues(id: string) {
    const result = await this.getActivityLogValuesUseCase.execute({ logId: id })
    if (result.success && this.state.log) {
      this.changeState({
        ...this.state,
        log: {
          ...this.state.log,
          values: result.values,
        },
      })
    }
  }

  reset() {
    this.changeState(initialActivityLogDetailState)
  }
}
