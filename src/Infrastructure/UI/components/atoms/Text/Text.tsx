import React from 'react'
import s from './Text.module.css'

export type TextAs =
  | 'p'
  | 'span'
  | 'label'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'a'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: TextAs
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  weight?: 'normal' | 'medium' | 'bold'
  muted?: boolean
  truncate?: boolean
  href?: string
  color?: string
}

export const Text: React.FC<TextProps> = ({
  children,
  as: Tag = 'p',
  size = 'md',
  weight = 'normal',
  muted,
  truncate,
  href,
  color,
  ...props
}) => {
  const extraProps = Tag === 'a' ? { href } : {}
  return (
    <Tag
      className={s.text}
      data-size={size}
      data-weight={weight}
      data-muted={muted || undefined}
      data-truncate={truncate || undefined}
      style={{ color }}
      {...extraProps}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Text
