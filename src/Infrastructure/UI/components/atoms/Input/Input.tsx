import React from 'react';
import s from './Input.module.css';

export type InputType = 'text' | 'password' | 'number' | 'search' | 'email';

type InputSize = 'sm' | 'md' | 'lg';
type InputState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  inputSize?: InputSize;
  state?: InputState;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  inputSize = 'md',
  state = 'default',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  icon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  iconPosition,
  ...props
}) => {
  return (
    <input
      className={s.input}
      type={type}
      data-size={inputSize}
      data-state={state}
      {...props}
    />
  );
};

export default Input;
