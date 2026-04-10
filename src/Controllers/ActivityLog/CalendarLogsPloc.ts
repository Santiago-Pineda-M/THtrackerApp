import { Ploc, initialCalendarLogsState } from '../../Domain'
import type { ICalendarLogsState } from '../../Domain'
import type { GetCalendarLogsUseCase } from '../../Application/UseCases/ActivityLog'

export class CalendarLogsPloc extends Ploc<ICalendarLogsState> {
  private readonly getCalendarLogsUseCase: GetCalendarLogsUseCase

  constructor(getCalendarLogsUseCase: GetCalendarLogsUseCase) {
    super(initialCalendarLogsState)
    this.getCalendarLogsUseCase = getCalendarLogsUseCase
  }

  async loadWeek(date: Date) {
    // Calculamos el inicio y fin de la semana (Lunes a Domingo o Domingo a Sábado)
    // Para Google Calendar típicamente empieza el Domingo
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
      error: null,
    })

    const result = await this.getCalendarLogsUseCase.execute({
      startDate: startOfWeek,
      endDate: endOfWeek,
    })

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
