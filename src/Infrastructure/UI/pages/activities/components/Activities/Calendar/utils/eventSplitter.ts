import type { LogEventView } from '../CalendarEvent'
import type {
  ActivityLogResponse,
  ActivityResponse,
  CategoryResponse,
} from '../../../../../../../../Domain'

interface SplitParams {
  log: ActivityLogResponse
  activity: ActivityResponse | undefined
  category: CategoryResponse | undefined
  pixelsPerHour: number
  parseDate: (date: string) => Date
  now: () => Date
}

export const splitEventByDay = ({
  log,
  activity,
  category,
  pixelsPerHour,
  parseDate,
  now,
}: SplitParams): LogEventView[] => {
  const startedAt = parseDate(log.startedAt)
  let endedAt = log.endedAt ? parseDate(log.endedAt) : now()

  // Ensure endedAt is after startedAt
  if (endedAt < startedAt) endedAt = startedAt

  const fragments: LogEventView[] = []
  let currentStart = new Date(startedAt)

  while (currentStart < endedAt) {
    const dayEnd = new Date(currentStart)
    dayEnd.setHours(23, 59, 59, 999)

    const fragmentEnd = endedAt < dayEnd ? endedAt : dayEnd
    const duration = (fragmentEnd.getTime() - currentStart.getTime()) / 60000

    const startHour = currentStart.getHours()
    const startMin = currentStart.getMinutes()
    const top = startHour * pixelsPerHour + startMin * (pixelsPerHour / 60)
    const height = Math.max(duration * (pixelsPerHour / 60), 10)

    fragments.push({
      id:
        fragments.length === 0
          ? log.id
          : `${log.id}-fragment-${fragments.length}`,
      title: activity ? activity.name || 'Actividad' : 'Desconocido',
      startedAt: new Date(currentStart),
      endedAt: new Date(fragmentEnd),
      durationMinutes: duration,
      activityColor: activity?.color || null,
      categoryColor: category?.color || null,
      top,
      height,
      left: 0,
      width: 100,
      rawLog: log,
    })

    // Prepare next day start
    currentStart = new Date(dayEnd.getTime() + 1)
  }

  return fragments
}
