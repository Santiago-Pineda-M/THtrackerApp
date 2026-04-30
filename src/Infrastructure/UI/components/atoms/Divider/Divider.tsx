import s from './Divider.module.scss'

export interface DividerProps {
  vertical?: boolean
  spacing?: 'sm' | 'md' | 'lg' | 'none'
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  vertical,
  spacing = 'sm',
  className,
}) => {
  return (
    <hr
      className={`${s.divider} ${className}`}
      data-vertical={vertical || undefined}
      data-spacing={spacing}
    />
  )
}

export default Divider
