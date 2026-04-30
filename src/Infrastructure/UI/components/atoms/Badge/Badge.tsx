import React from 'react'
import s from './Badge.module.scss'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: BadgeVariant
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  dot,
  ...props
}) => {
  return (
    <span
      className={s.badge}
      data-variant={variant}
      data-dot={dot || undefined}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
