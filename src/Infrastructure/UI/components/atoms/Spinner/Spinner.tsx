import s from './Spinner.module.css'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  return (
    <span
      className={s.spinner}
      aria-label='cargando'
      data-size={size}
    />
  )
}

export default Spinner
