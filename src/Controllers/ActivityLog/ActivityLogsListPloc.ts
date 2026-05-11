import {
  Ploc,
  initialActivityLogsListState,
  type IActivityLogsListState,
} from '../../Domain'
import {
  GetActivityLogsUseCase,
  type ActivityLogResponsePaginated,
  type ProblemDetails,
  // type GetActivityLogsRequest,
} from '../../Application/UseCases/ActivityLog/GetActivityLogsUseCase'
import {
  StartActivityLogUseCase,
  type ActivityLogResponse,
} from '../../Application/UseCases/ActivityLog/StartActivityLogUseCase'
import { StopActivityLogUseCase } from '../../Application/UseCases/ActivityLog/StopActivityLogUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class ActivityLogsListPloc extends Ploc<IActivityLogsListState> {
  private readonly getActivityLogsUseCase: GetActivityLogsUseCase
  private readonly startActivityLogUseCase: StartActivityLogUseCase
  private readonly stopActivityLogUseCase: StopActivityLogUseCase

  constructor(
    getActivityLogsUseCase: GetActivityLogsUseCase,
    startActivityLogUseCase: StartActivityLogUseCase,
    stopActivityLogUseCase: StopActivityLogUseCase
  ) {
    super(initialActivityLogsListState)
    this.getActivityLogsUseCase = getActivityLogsUseCase
    this.startActivityLogUseCase = startActivityLogUseCase
    this.stopActivityLogUseCase = stopActivityLogUseCase
  }

  async getLogs(activityId: string) {
    this.changeState({
      ...this.state,
      activityId,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getActivityLogsUseCase.execute({
        activityId,
      })

      if (this.isActivityLogsSuccess(result)) {
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

  async startLog() {
    if (!this.state.activityId) return

    this.changeState({ ...this.state, isLoading: true, errors: {} })

    try {
      const result = await this.startActivityLogUseCase.execute({
        activityId: this.state.activityId,
      })

      if (this.isActivityLogSuccess(result)) {
        this.changeState({
          ...this.state,
          logs: this.state.logs
            ? {
                ...this.state.logs,
                items: [result, ...(this.state.logs.items || [])],
              }
            : { items: [result] },
          isLoading: false,
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

  async stopLog(logId: string) {
    this.changeState({ ...this.state, isLoading: true, errors: {} })

    try {
      const result = await this.stopActivityLogUseCase.execute({ id: logId })

      if (this.isActivityLogSuccess(result)) {
        const updatedLogs = this.state.logs?.items?.map((log) =>
          log.id === logId ? result : log
        )
        this.changeState({
          ...this.state,
          logs: this.state.logs
            ? { ...this.state.logs, items: updatedLogs }
            : null,
          isLoading: false,
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

  private isActivityLogsSuccess(
    result: ActivityLogResponsePaginated | ProblemDetails
  ): result is ActivityLogResponsePaginated {
    return 'items' in result
  }

  private isActivityLogSuccess(
    result: ActivityLogResponse | ProblemDetails
  ): result is ActivityLogResponse {
    return 'id' in result && 'activityId' in result
  }

  reset() {
    this.changeState(initialActivityLogsListState)
  }
}
