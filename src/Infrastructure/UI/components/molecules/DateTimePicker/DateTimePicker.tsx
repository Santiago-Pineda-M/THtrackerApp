import React, { useMemo, useCallback, useRef } from 'react'
import styles from './DateTimePicker.module.css'

// ─── Static data (outside component to avoid recreation) ───────────────────
const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function parseValue(value: string) {
  const date = value ? new Date(value) : new Date()
  if (isNaN(date.getTime())) {
    const now = new Date()
    return {
      y: now.getFullYear(),
      m: now.getMonth() + 1,
      d: now.getDate(),
      h: now.getHours(),
      min: now.getMinutes(),
    }
  }
  return {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    min: date.getMinutes(),
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────
interface DateTimePickerProps {
  value: string // Format YYYY-MM-DDTHH:mm
  onChange: (value: string) => void
  disabled?: boolean
  label?: string
}

// ─── Stepper sub-component ──────────────────────────────────────────────────
interface StepperProps {
  value: number
  options: number[]
  format?: (n: number) => string
  label: string
  id: string
  onChange: (n: number) => void
  disabled?: boolean
  wide?: boolean
}

const Stepper: React.FC<StepperProps> = ({
  value,
  options,
  format = pad,
  label,
  id,
  onChange,
  disabled,
  wide,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null)

  const prev = useCallback(() => {
    const idx = options.indexOf(value)
    if (idx > 0) onChange(options[idx - 1])
  }, [value, options, onChange])

  const next = useCallback(() => {
    const idx = options.indexOf(value)
    if (idx < options.length - 1) onChange(options[idx + 1])
  }, [value, options, onChange])

  const lastWheel = useRef(0)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (disabled) return
      const now = Date.now()
      if (now - lastWheel.current < 80) return
      if (Math.abs(e.deltaY) > 5) {
        if (e.deltaY < 0) prev()
        else next()
        lastWheel.current = now
      }
    },
    [disabled, prev, next]
  )

  const touchY = useRef<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY
  }
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || touchY.current === null) return
      const delta = touchY.current - e.touches[0].clientY
      if (Math.abs(delta) > 30) {
        if (delta > 0) next()
        else prev()
        touchY.current = e.touches[0].clientY
      }
    },
    [disabled, prev, next]
  )
  const handleTouchEnd = () => {
    touchY.current = null
  }

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        next()
      }
    },
    [prev, next]
  )

  return (
    <div
      className={`${styles.stepper} ${wide ? styles.stepperWide : ''}`}
      onKeyDown={handleKey}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <label
        htmlFor={id}
        className={styles.stepperLabel}
      >
        {label}
      </label>

      <div className={styles.stepperInner}>
        <button
          type='button'
          className={styles.stepBtn}
          onClick={prev}
          disabled={disabled || options.indexOf(value) === 0}
          aria-label={`${label} anterior`}
          tabIndex={-1}
        >
          <svg
            width='10'
            height='6'
            viewBox='0 0 10 6'
            fill='none'
            aria-hidden='true'
          >
            <path
              d='M9 5L5 1L1 5'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <select
          ref={selectRef}
          id={id}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={styles.stepperSelect}
          aria-label={label}
        >
          {options.map((o) => (
            <option
              key={o}
              value={o}
            >
              {format(o)}
            </option>
          ))}
        </select>

        <button
          type='button'
          className={styles.stepBtn}
          onClick={next}
          disabled={disabled || options.indexOf(value) === options.length - 1}
          aria-label={`${label} siguiente`}
          tabIndex={-1}
        >
          <svg
            width='10'
            height='6'
            viewBox='0 0 10 6'
            fill='none'
            aria-hidden='true'
          >
            <path
              d='M1 1L5 5L9 1'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  disabled,
  label = 'Fecha y hora',
}) => {
  const {
    y: year,
    m: month,
    d: day,
    h: hour,
    min: minute,
  } = useMemo(() => parseValue(value), [value])

  const handleChange = useCallback(
    (updates: { y?: number; m?: number; d?: number; h?: number; min?: number }) => {
      const ny = updates.y ?? year
      const nm = updates.m ?? month
      const nh = updates.h ?? hour
      const nmin = updates.min ?? minute

      // Clamp day based on potentially new year/month
      const maxDays = new Date(ny, nm, 0).getDate()
      const nd = Math.min(updates.d ?? day, maxDays)

      onChange(`${ny}-${pad(nm)}-${pad(nd)}T${pad(nh)}:${pad(nmin)}`)
    },
    [year, month, day, hour, minute, onChange]
  )

  const years = useMemo(() => {
    const cur = new Date().getFullYear()
    return Array.from({ length: 11 }, (_, i) => cur + i)
  }, [])

  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month])
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth])

  const handleDay = useCallback((v: number) => handleChange({ d: v }), [handleChange])
  const handleMonth = useCallback((v: number) => handleChange({ m: v }), [handleChange])
  const handleYear = useCallback((v: number) => handleChange({ y: v }), [handleChange])
  const handleHour = useCallback((v: number) => handleChange({ h: v }), [handleChange])
  const handleMinute = useCallback((v: number) => handleChange({ min: v }), [handleChange])

  return (
    <fieldset
      className={`${styles.container} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
      aria-label={label}
    >
      <legend className={styles.legend}>{label}</legend>

      {/* Date group */}
      <div
        className={styles.group}
        role='group'
        aria-label='Fecha'
      >
        <Stepper
          id='dtp-day'
          label='Día'
          value={day}
          options={days}
          onChange={handleDay}
          disabled={disabled}
        />
        <div
          className={styles.dot}
          aria-hidden='true'
        />
        <Stepper
          id='dtp-month'
          label='Mes'
          value={month}
          options={MONTHS.map((_, i) => i + 1)}
          format={(n) => MONTHS[n - 1].slice(0, 3)}
          onChange={handleMonth}
          disabled={disabled}
          wide
        />
        <div
          className={styles.dot}
          aria-hidden='true'
        />
        <Stepper
          id='dtp-year'
          label='Año'
          value={year}
          options={years}
          format={(n) => String(n)}
          onChange={handleYear}
          disabled={disabled}
          wide
        />
      </div>

      <div
        className={styles.divider}
        role='separator'
        aria-hidden='true'
      />

      {/* Time group */}
      <div
        className={styles.group}
        role='group'
        aria-label='Hora'
      >
        <Stepper
          id='dtp-hour'
          label='Hora'
          value={hour}
          options={HOURS}
          onChange={handleHour}
          disabled={disabled}
        />
        <span
          className={styles.colon}
          aria-hidden='true'
        >
          :
        </span>
        <Stepper
          id='dtp-minute'
          label='Min'
          value={minute}
          options={MINUTES}
          onChange={handleMinute}
          disabled={disabled}
        />
      </div>
    </fieldset>
  )
}
