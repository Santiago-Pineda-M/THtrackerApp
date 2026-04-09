import React from 'react'
import s from './Input.module.css'

export type InputType =
  | 'text'
  | 'password'
  | 'number'
  | 'search'
  | 'email'
  | 'color'

export type InputElement = React.ElementRef<'input'>

type InputSize = 'sm' | 'md' | 'lg'
type InputState = 'default' | 'error' | 'success'

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  type?: InputType
  inputSize?: InputSize
  state?: InputState
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { type = 'text', inputSize = 'md', state = 'default', className, ...props },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        data-size={inputSize}
        data-state={state}
        className={`${s.input} ${className ?? ''}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input
