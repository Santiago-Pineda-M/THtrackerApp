import React from 'react'
import styles from './CalendarGrid.module.css'
import { CalendarEvent, type LogEventView } from './CalendarEvent'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'

interface Props {
  weekDates: Date[]
  events: LogEventView[]
  pixelsPerHour: number
}

const hours = Array.from({ length: 24 }, (_, i) => i)

export const CalendarGrid: React.FC<Props> = ({
  weekDates,
  events,
  pixelsPerHour,
}) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className={styles.calendarBody}>
      {/* Columna de las horas (Gutter) */}
      <div className={styles.timeGutter}>
        {hours.map((hour) => (
          <div
            key={hour}
            className={styles.timeSlot}
            style={{ height: `${pixelsPerHour}px` }}
          >
            <span>{hour === 0 ? '' : `${hour}:00`}</span>
          </div>
        ))}
      </div>

      {/* Contenido principal (malla) */}
      <div
        className={styles.gridContent}
        style={{
          height: `${24 * pixelsPerHour}px`,
          backgroundSize: `100% ${pixelsPerHour}px`,
        }}
      >
        <CurrentTimeIndicator pixelsPerHour={pixelsPerHour} />

        {weekDates.map((date, idx) => {
          const dateCopy = new Date(date)
          dateCopy.setHours(0, 0, 0, 0)
          const isToday = dateCopy.getTime() === today.getTime()

          // Filtrar los eventos correspondientes a este día
          const dayEvents = events.filter((e) => {
            return (
              e.startedAt.getDate() === date.getDate() &&
              e.startedAt.getMonth() === date.getMonth() &&
              e.startedAt.getFullYear() === date.getFullYear()
            )
          })

          return (
            <div
              key={idx}
              className={`${styles.dayColumn} ${isToday ? styles.isToday : ''}`}
            >
              {dayEvents.map((event) => (
                <CalendarEvent
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
