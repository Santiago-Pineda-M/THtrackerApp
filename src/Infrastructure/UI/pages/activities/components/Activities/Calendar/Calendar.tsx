import { useState, useEffect, useMemo, useRef } from 'react'
import { Card, Button, Icon, Text, Badge } from '../../../../../components'
import { Modal } from '../../../../../components/molecules'
import styles from './Calendar.module.scss'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import type { LogEventView } from './CalendarEvent'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import { calculateOverlap } from './utils/overlap'
import { splitEventByDay } from './utils/eventSplitter'

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

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<LogEventView | null>(null)

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

    if (
      activitiesState.activities?.items?.length === 0 &&
      !activitiesState.isLoading
    ) {
      providerActivitiesListPloc.loadActivities()
    }

    if (
      categoriesState.categories?.items?.length === 0 &&
      !categoriesState.isLoading
    ) {
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

  // Map Logs -> Events (splitting those that cross midnight)
  const events: LogEventView[] = useMemo(() => {
    const eventViews =
      calendarState.logs?.items?.flatMap((log) => {
        const activity = activitiesState.activities?.items?.find(
          (a) => a.id === log.activityId
        )
        const category =
          activity &&
          categoriesState.categories?.items?.find(
            (c) => c.id === activity.categoryId
          )

        return splitEventByDay({
          log,
          activity,
          category,
          pixelsPerHour,
          parseDate: providerDateProvider.parse,
          now: providerDateProvider.now,
        })
      }) ?? []

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

  const handleEventClick = (event: LogEventView) => {
    setSelectedEvent(event)
  }

  const formatDuration = (minutes: number): string => {
    const totalSeconds = Math.round(minutes * 60)
    const hours = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    if (hours > 0) return `${pad(hours)}:${pad(mins)}:${pad(secs)}`
    return `${pad(mins)}:${pad(secs)}`
  }

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
          onEventClick={handleEventClick}
        />

        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title='Detalle del Registro'
        >
          {selectedEvent && (
            <div className={styles.modalContent}>
              <div className={styles.detailRow}>
                <Text weight='medium'>Actividad:</Text>
                <Text>{selectedEvent.title}</Text>
              </div>
              <div className={styles.detailRow}>
                <Text weight='medium'>Fecha:</Text>
                <Text>
                  {providerDateProvider.formatDate(selectedEvent.startedAt)}
                </Text>
              </div>
              <div className={styles.detailRow}>
                <Text weight='medium'>Hora de inicio:</Text>
                <Text>
                  {providerDateProvider.formatTime(selectedEvent.startedAt)}
                </Text>
              </div>
              <div className={styles.detailRow}>
                <Text weight='medium'>Hora de fin:</Text>
                <Text>
                  {selectedEvent.rawLog.endedAt
                    ? providerDateProvider.formatTime(selectedEvent.endedAt)
                    : 'En curso'}
                </Text>
              </div>
              <div className={styles.detailRow}>
                <Text weight='medium'>Duración:</Text>
                <Badge
                  variant={selectedEvent.rawLog.endedAt ? 'default' : 'success'}
                >
                  {selectedEvent.rawLog.endedAt
                    ? formatDuration(selectedEvent.durationMinutes)
                    : 'En curso'}
                </Badge>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  )
}

export default Calendar
