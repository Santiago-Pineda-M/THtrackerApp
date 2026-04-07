import s from './ToggleSwitch.module.css'

export type ToggleSwitchSize = 'sm' | 'md'

export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: ToggleSwitchSize
  label?: string
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled,
  size = 'md',
}) => {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      disabled={disabled}
      data-size={size}
      className={s.toggleSwitch}
      onClick={() => onChange(!checked)}
    />
  )
}

export default ToggleSwitch
