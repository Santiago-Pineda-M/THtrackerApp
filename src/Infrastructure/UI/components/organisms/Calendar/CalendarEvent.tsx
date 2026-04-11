import React from 'react'
import styles from './Calendar.module.css'

export interface LogEventView {
  id: string
  title: string
  startedAt: Date
  endedAt: Date
  durationMinutes: number
  activityColor: string | null
  categoryColor: string | null
  // Positioning
  top: number
  height: number
  left: number // Percentage 0-100
  width: number // Percentage 0-100
}

interface Props {
  event: LogEventView
}

// Convert RGB/Hex to rgba for soft background
const getBgColor = (color: string | null) => {
  if (!color) return 'rgba(99, 102, 241, 0.2)' // Default indigo soft
  if (color.startsWith('#')) {
    // very rudimentary alpha adding for hex
    return `${color}88` // 88 is roughly 53% opacity
  }
  return color
}

const getBorderColor = (color: string | null) => {
  if (!color) return 'var(--color-accent)'
  return color
}

export const CalendarEvent: React.FC<Props> = ({ event }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const bgColor = getBgColor(event.activityColor)
  const borderColor = getBorderColor(event.categoryColor)

  return (
    <div
      className={styles.eventBlock}
      style={{
        top: `${event.top}px`,
        height: `${Math.max(event.height, 24)}px`, // min height for visibility
        left: `${event.left}%`,
        width: `${event.width}%`, // prevent touching neighbors
        backgroundColor: bgColor,
        borderColor: ` ${borderColor}`,
      }}
      title={`
        ${event.title} : ${formatTime(event.startedAt)} - ${formatTime(event.endedAt)}
        `}
    >
      <div className={styles.eventTitle}>{event.title}</div>
      {event.height > 20 && (
        <div className={styles.eventTime}>
          {formatTime(event.startedAt)} - {formatTime(event.endedAt)}
        </div>
      )}
    </div>
  )
}
