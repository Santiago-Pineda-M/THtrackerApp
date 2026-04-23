import { useState, useEffect, useMemo, useRef } from 'react'
import { Card, Button, Icon } from '../../../../../components'
import styles from './Calendar.module.css'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import type { LogEventView } from './CalendarEvent'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import { calculateOverlap } from './utils/overlap'

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

  // Zoom State
  const [pixelsPerHour, setPixelsPerHour] = useState<number>(30)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Handle Zoom Scroll (Non-passive listener to prevent browser zoom)
  useEffect(() => {
    const calendarEl = calendarRef.current
    if (!calendarEl) return

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const zoomFactor = e.deltaY > 0 ? -10 : 10
        setPixelsPerHour((prev) =>
          Math.min(Math.max(prev + zoomFactor, 30), 200)
        )
      }
    }

    calendarEl.addEventListener('wheel', handleWheel, { passive: false })
    return () => calendarEl.removeEventListener('wheel', handleWheel)
  }, [])

  const handleZoomIn = () =>
    setPixelsPerHour((prev: number) => Math.min(prev + 20, 200))
  const handleZoomOut = () =>
    setPixelsPerHour((prev: number) => Math.max(prev - 20, 30))

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

      if (!endedAt) {
        endedAt = providerDateProvider.now()
      }
      const duration = (endedAt.getTime() - startedAt.getTime()) / 60000

      // Position logic based on dynamic pixelsPerHour
      const startHour = startedAt.getHours()
      const startMin = startedAt.getMinutes()
      const top = startHour * pixelsPerHour + startMin * (pixelsPerHour / 60)
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
    pixelsPerHour,
  ])

  return (
    <Card
      h={3}
      w={6}
      className={styles.calendarCard}
    >
      <div
        ref={calendarRef}
        className={styles.calendarContainer}
      >
        <div className={styles.calendarControls}>
          <div className={styles.controlsGroup}>
            <Button
              variant='ghost'
              size='sm'
              icon={<Icon name='ChevronLeft' />}
              onClick={() => providerCalendarLogsPloc.prevWeek()}
            />
            <Button
              variant='secondary'
              size='sm'
              icon={<Icon name='Target' />}
              onClick={() => providerCalendarLogsPloc.loadWeek(new Date())}
            >
              Hoy
            </Button>
            <Button
              variant='ghost'
              size='sm'
              icon={<Icon name='ChevronRight' />}
              onClick={() => providerCalendarLogsPloc.nextWeek()}
            />
          </div>

          <div className={styles.weekLabel}>
            {weekDates[0]?.toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric',
            })}
          </div>

          <div className={styles.controlsGroup}>
            <Button
              variant='ghost'
              size='sm'
              icon={<Icon name='Plus' />}
              onClick={handleZoomIn}
              title='Zoom In (Ctrl + Scroll Up)'
            />
            <Button
              variant='ghost'
              size='sm'
              icon={<Icon name='Minus' />}
              onClick={handleZoomOut}
              title='Zoom Out (Ctrl + Scroll Down)'
            />
            <Button
              variant='ghost'
              size='sm'
              loading={calendarState.isLoading}
              icon={<Icon name='RefreshCw' />}
              onClick={() =>
                providerCalendarLogsPloc.loadWeek(calendarState.currentWeekDate)
              }
            />
          </div>
        </div>

        <CalendarHeader weekDates={weekDates} />

        <CalendarGrid
          weekDates={weekDates}
          events={events}
          pixelsPerHour={pixelsPerHour}
        />
      </div>
    </Card>
  )
}

export default Calendar
