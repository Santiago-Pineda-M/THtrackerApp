import { useEffect, useMemo } from 'react'
import { Card } from '../../'
import styles from './Calendar.module.css'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import type { LogEventView } from './CalendarEvent'
import { useDependencies } from '../../../../Context/useDependencies'
import { usePlocState } from '../../../../Hooks/usePlocState'

// Helper para calcular Overlap
const calculateOverlap = (events: LogEventView[]) => {
  // Sort by start time
  events.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())

  const groups: LogEventView[][] = []
  let currentGroup: LogEventView[] = []
  let groupEnd = 0

  events.forEach((event) => {
    const start = event.startedAt.getTime()
    const end = event.endedAt.getTime()
    if (start >= groupEnd) {
      if (currentGroup.length > 0) groups.push(currentGroup)
      currentGroup = [event]
      groupEnd = end
    } else {
      currentGroup.push(event)
      groupEnd = Math.max(groupEnd, end)
    }
  })
  if (currentGroup.length > 0) groups.push(currentGroup)

  groups.forEach((group) => {
    const columns: LogEventView[][] = []

    group.forEach((event) => {
      let placed = false
      for (const col of columns) {
        const lastInCol = col[col.length - 1]
        // Allow placement if previous event ends before or identically at the start of this event
        if (lastInCol.endedAt.getTime() <= event.startedAt.getTime()) {
          col.push(event)
          placed = true
          break
        }
      }
      if (!placed) {
        columns.push([event])
      }
    })

    const numCols = columns.length
    columns.forEach((col, colIdx) => {
      col.forEach((event) => {
        event.width = 100 / numCols
        event.left = (100 / numCols) * colIdx
      })
    })
  })

  return events
}

export const Calendar = () => {
  const {
    providerCalendarLogsPloc,
    providerActivitiesListPloc,
    providerCategoriesListPloc,
    providerDateProvider,
  } = useDependencies()
  const calendarState = usePlocState(providerCalendarLogsPloc)
  const activitiesState = usePlocState(providerActivitiesListPloc)
  const categoriesState = usePlocState(providerCategoriesListPloc)

  // Carga inicial
  useEffect(() => {
    providerCalendarLogsPloc.loadWeek(new Date())

    if (activitiesState.activities.length === 0 && !activitiesState.isLoading) {
      providerActivitiesListPloc.loadActivities()
    }

    if (categoriesState.categories.length === 0 && !categoriesState.isLoading) {
      providerCategoriesListPloc.loadCategories()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fechas semana
  const weekDates = useMemo(() => {
    const weekStart = new Date(calendarState.currentWeekDate)
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      return d
    })
  }, [calendarState.currentWeekDate])

  // Map Logs -> Events
  const events: LogEventView[] = useMemo(() => {
    const eventViews = calendarState.logs.map((log) => {
      const activity = activitiesState.activities.find(
        (a) => a.id === log.activityId
      )
      const category =
        activity &&
        categoriesState.categories.find((c) => c.id === activity.categoryId)

      const startedAt = providerDateProvider.parse(log.startedAt)
      let endedAt = log.endedAt ? providerDateProvider.parse(log.endedAt) : null

      // Calculate duration. If there's no endedAt, assume it's ongoing up to now,
      // but cap to the end of the day or rely on its startedAt.
      if (!endedAt) {
        endedAt = providerDateProvider.now()
      }
      const duration = (endedAt.getTime() - startedAt.getTime()) / 60000

      // Position logic: Top based on start hour/min
      const pixelsPerHour = 60
      const startHour = startedAt.getHours()
      const startMin = startedAt.getMinutes()
      const top = startHour * pixelsPerHour + startMin * (pixelsPerHour / 60)
      // Min height 10 pixels roughly 10 mins
      const height = Math.max(duration * (pixelsPerHour / 60), 10)

      return {
        id: log.id,
        title: activity ? activity.name || 'Actividad' : 'Desconocido',
        startedAt,
        endedAt,
        durationMinutes: duration,
        activityColor: activity?.color || null,
        categoryColor: category?.color || null,
        top,
        height,
        left: 0,
        width: 100,
      }
    })

    // Grouping events per day to calculate overlaps
    const groupedByDay: Record<string, LogEventView[]> = {}
    eventViews.forEach((ev) => {
      const key = ev.startedAt.toDateString()
      if (!groupedByDay[key]) groupedByDay[key] = []
      groupedByDay[key].push(ev)
    })

    // Calculate overlaps per day
    Object.values(groupedByDay).forEach((dayEvents) => {
      calculateOverlap(dayEvents)
    })

    return eventViews
  }, [
    calendarState.logs,
    activitiesState.activities,
    categoriesState.categories,
    providerDateProvider,
  ])

  return (
    <Card
      h={5}
      w={6}
      className={styles.calendarCard}
    >
      <div className={styles.calendarContainer}>
        <div className={styles.calendarControls}>
          <button onClick={() => providerCalendarLogsPloc.prevWeek()}>
            &lt; Prev
          </button>
          <div className={styles.weekLabel}>
            {weekDates[0]?.toLocaleDateString()} -{' '}
            {weekDates[6]?.toLocaleDateString()}
          </div>
          <button onClick={() => providerCalendarLogsPloc.nextWeek()}>
            Next &gt;
          </button>
        </div>
        <CalendarHeader weekDates={weekDates} />
        <CalendarGrid
          weekDates={weekDates}
          events={events}
        />
      </div>
    </Card>
  )
}
