import React from 'react'
import styles from './CalendarHeader.module.css'

interface Props {
  weekDates: Date[]
}

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export const CalendarHeader: React.FC<Props> = ({ weekDates }) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className={styles.calendarHeader}>
      <div className={styles.timeGutterHeader}></div>
      {weekDates.map((date, idx) => {
        const dateCopy = new Date(date)
        dateCopy.setHours(0, 0, 0, 0)
        const isToday = dateCopy.getTime() === today.getTime()

        return (
          <div
            key={idx}
            className={`${styles.dayColumnHeader} ${
              isToday ? styles.isTodayHeader : ''
            }`}
          >
            <span className={styles.dayName}>{dayNames[date.getDay()]}</span>
            <span
              className={`${styles.dayNumber} ${isToday ? styles.isToday : ''}`}
            >
              {date.getDate()}
            </span>
          </div>
        )
      })}
    </div>
  )
}
