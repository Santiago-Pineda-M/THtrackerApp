import s from './Divider.module.css'

export interface DividerProps {
  vertical?: boolean
  spacing?: 'sm' | 'md' | 'lg' | 'none'
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  vertical,
  spacing = 'md',
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
