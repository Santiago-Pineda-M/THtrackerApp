import React from 'react'
import styles from './Calendar.module.css'
import { CalendarEvent, type LogEventView } from './CalendarEvent'

interface Props {
  weekDates: Date[]
  events: LogEventView[]
}

const hours = Array.from({ length: 24 }, (_, i) => i)

export const CalendarGrid: React.FC<Props> = ({ weekDates, events }) => {
  return (
    <div className={styles.calendarBody}>
      {/* Columna de las horas */}
      <div className={styles.timeGutter}>
        {hours.map((hour) => (
          <div
            key={hour}
            className={styles.timeSlot}
          >
            {hour === 0 ? '' : `${hour}:00`}
          </div>
        ))}
      </div>

      {/* Contenido principal (malla) */}
      <div className={styles.gridContent}>
        {weekDates.map((date, idx) => {
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
              className={styles.dayColumn}
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
