import React from 'react'
import styles from './CalendarEvent.module.css'

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
  if (!color) return 'rgba(99, 102, 241, 0.15)'
  if (color.startsWith('#')) {
    // Soft transparent background
    return `${color}22` // Ultra soft transparency
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
  const borderColor = getBorderColor(event.categoryColor || event.activityColor)

  return (
    <div
      className={styles.eventBlock}
      style={{
        top: `${event.top}px`,
        height: `${Math.max(event.height, 24)}px`,
        left: `${event.left}%`,
        width: `${event.width - 2}%`, // Slight gap between concurrent events
        backgroundColor: bgColor,
        borderLeftColor: borderColor,
        borderLeftWidth: '4px',
        color: borderColor, // Text color matches border for better contrast on light alpha bg
      }}
      title={`
        ${event.title}
        ${formatTime(event.startedAt)} - ${formatTime(event.endedAt)}
        `}
    >
      <div
        className={styles.eventTitle}
        style={{ color: 'var(--color-text-primary)' }}
      >
        {event.title}
      </div>
      {event.height > 30 && (
        <div className={styles.eventTime}>
          {formatTime(event.startedAt)} - {formatTime(event.endedAt)}
        </div>
      )}
    </div>
  )
}
