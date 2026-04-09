import s from './ProgressBar.module.css'
import { Text } from '../../atoms/Text/Text'

interface ProgressBarProps {
  value: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  label?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'default',
  label,
}) => {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={s.wrap}>
      {label && <Text size='xs'>{label}</Text>}
      <div className={s.track}>
        <div
          className={s.fill}
          data-variant={variant}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
