import type { LogEventView } from '../CalendarEvent'

/**
 * UTILITY - calculateOverlap
 * Calcula la posición (left) y el ancho (width) de los eventos que se solapan
 * para que se muestren en columnas paralelas.
 */
export const calculateOverlap = (events: LogEventView[]): LogEventView[] => {
  // Sort by start time
  const sortedEvents = [...events].sort(
    (a, b) => a.startedAt.getTime() - b.startedAt.getTime()
  )

  const groups: LogEventView[][] = []
  let currentGroup: LogEventView[] = []
  let groupEnd = 0

  sortedEvents.forEach((event) => {
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

  return sortedEvents
}
