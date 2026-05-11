import { Ploc, initialActivityLogDetailState } from '../../Domain'
import type { IActivityLogDetailState } from '../../Domain'
import {
  GetActivityLogByIdUseCase,
  type ProblemDetails,
  type ActivityLogResponse,
} from '../../Application/UseCases/ActivityLog/GetActivityLogByIdUseCase'
import { UpdateActivityLogUseCase } from '../../Application/UseCases/ActivityLog/UpdateActivityLogUseCase'
import {
  SaveActivityLogValuesUseCase,
  type SaveLogValuesCommand,
} from '../../Application/UseCases/ActivityLog/SaveActivityLogValuesUseCase'
import {
  GetActivityLogValuesUseCase,
  type LogValueResponsePaginated,
} from '../../Application/UseCases/ActivityLog/GetActivityLogValuesUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

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
      errors: {},
      success: false,
      message: '',
    })

    try {
      const result = await this.getActivityLogByIdUseCase.execute({ id })

      if (this.isActivityLogSuccess(result)) {
        this.changeState({
          ...this.state,
          log: result,
          isLoading: false,
          success: true,
          message: 'Registro obtenido exitosamente',
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        log: null,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        log: null,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  async updateLog(id: string, startedAt: string, endedAt: string | null) {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
      success: false,
      message: '',
    })

    try {
      const result = await this.updateActivityLogUseCase.execute({
        id,
        startedAt,
        endedAt,
      })

      if (this.isActivityLogSuccess(result)) {
        this.changeState({
          ...this.state,
          log: result,
          isLoading: false,
          success: true,
          message: 'Registro de fecha actualizado exitosamente',
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: mappedErrors,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  async saveValues(id: string, values: SaveLogValuesCommand) {
    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
      success: false,
      message: '',
    })

    try {
      const result = await this.saveActivityLogValuesUseCase.execute({
        id: { id },
        requests: values,
      })

      if (this.isSaveValuesError(result)) {
        const mappedErrors = mapProblemDetailsToErrors(result)
        this.changeState({
          ...this.state,
          isLoading: false,
          errors: mappedErrors,
        })
        return
      }

      // Después de guardar métricas, recargamos el detalle del log para tener sus custom values fresquitos
      await this.getLogDetail(id)
      this.changeState({
        ...this.state,
        success: true,
        message: 'Valores adicionales guardados exitosamente',
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  async fetchValues(id: string) {
    try {
      const result = await this.getActivityLogValuesUseCase.execute({ id })
      if (this.isValuesSuccess(result) && this.state.log) {
        this.changeState({
          ...this.state,
          log: {
            ...this.state.log,
          },
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  private isActivityLogSuccess(
    result: ActivityLogResponse | ProblemDetails
  ): result is ActivityLogResponse {
    return 'id' in result && 'activityId' in result
  }

  private isSaveValuesError(
    result: void | ProblemDetails
  ): result is ProblemDetails {
    return typeof result === 'object' && result !== null && 'type' in result
  }

  private isValuesSuccess(
    result: LogValueResponsePaginated | ProblemDetails
  ): result is LogValueResponsePaginated {
    return 'items' in result
  }

  reset() {
    this.changeState(initialActivityLogDetailState)
  }
}
