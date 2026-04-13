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
  children?: React.ReactNode
  as?: TextAs
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  weight?: 'normal' | 'medium' | 'bold'
  muted?: boolean
  truncate?: boolean
  href?: string
  color?: string
}

const sizeClasses: Record<string, string> = {
  xl: s.sizeXl,
  lg: s.sizeLg,
  md: s.sizeMd,
  sm: s.sizeSm,
  xs: s.sizeXs,
}

const weightClasses: Record<string, string> = {
  normal: s.weightNormal,
  medium: s.weightMedium,
  bold: s.weightBold,
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
  className,
  ...props
}) => {
  const extraProps = Tag === 'a' ? { href } : {}

  const classNames = [
    s.text,
    sizeClasses[size],
    weightClasses[weight],
    muted && s.muted,
    truncate && s.truncate,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      className={classNames}
      style={{ color }}
      {...extraProps}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Text
