import { useEffect, useState } from 'react'
import { type TextProps, Text } from '../../'

interface ChronometerProps {
  time: number
  textProps?: TextProps
}

export const Chronometer = ({ time, textProps }: ChronometerProps) => {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = now.getTime() - time
      const hours = Math.floor(diff / 1000 / 60 / 60)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setHours(hours)
      setMinutes(minutes)
      setSeconds(seconds)
    }, 1000)
    return () => clearInterval(interval)
  }, [time])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <Text {...textProps}>
      {formatNumber(hours)} : {formatNumber(minutes)} : {formatNumber(seconds)}
    </Text>
  )
}
