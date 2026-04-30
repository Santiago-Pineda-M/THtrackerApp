import React, { useEffect, useState } from 'react'
import styles from './CurrentTimeIndicator.module.scss'

interface Props {
  pixelsPerHour: number
}

/**
 * COMPONENT - CurrentTimeIndicator
 * Renderiza una línea roja con un punto que indica la hora actual.
 */
export const CurrentTimeIndicator: React.FC<Props> = ({ pixelsPerHour }) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 60000) // Actualizar cada minuto
    return () => clearInterval(timer)
  }, [])

  const currentHour = now.getHours()
  const currentMin = now.getMinutes()
  const top = currentHour * pixelsPerHour + currentMin * (pixelsPerHour / 60)

  return (
    <div
      className={styles.currentTimeIndicator}
      style={{ top: `${top}px` }}
    >
      <div className={styles.currentTimeCircle} />
      <div className={styles.currentTimeLine} />
    </div>
  )
}
