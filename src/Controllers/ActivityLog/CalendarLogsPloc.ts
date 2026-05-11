import { Ploc, initialCalendarLogsState } from '../../Domain'
import type { ICalendarLogsState } from '../../Domain'
import type {
  GetCalendarLogsUseCase,
  ActivityLogPaginatedResponse,
  ProblemDetails,
} from '../../Application/UseCases/ActivityLog/GetCalendarLogsUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class CalendarLogsPloc extends Ploc<ICalendarLogsState> {
  private readonly getCalendarLogsUseCase: GetCalendarLogsUseCase

  constructor(getCalendarLogsUseCase: GetCalendarLogsUseCase) {
    super(initialCalendarLogsState)
    this.getCalendarLogsUseCase = getCalendarLogsUseCase
  }

  async loadWeek(date: Date) {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // Domingo
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // Sábado
    endOfWeek.setHours(23, 59, 59, 999)

    this.changeState({
      ...this.state,
      currentWeekDate: startOfWeek,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getCalendarLogsUseCase.execute({
        from: startOfWeek.toISOString(),
        to: endOfWeek.toISOString(),
      })

      if (this.isCalendarLogsSuccess(result)) {
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

  private isCalendarLogsSuccess(
    result: ActivityLogPaginatedResponse | ProblemDetails
  ): result is ActivityLogPaginatedResponse {
    return 'items' in result
  }

  nextWeek() {
    const nextDate = new Date(this.state.currentWeekDate)
    nextDate.setDate(nextDate.getDate() + 7)
    this.loadWeek(nextDate)
  }

  prevWeek() {
    const prevDate = new Date(this.state.currentWeekDate)
    prevDate.setDate(prevDate.getDate() - 7)
    this.loadWeek(prevDate)
  }

  reset() {
    this.changeState(initialCalendarLogsState)
  }
}
