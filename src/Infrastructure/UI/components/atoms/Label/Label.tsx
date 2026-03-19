import React from 'react';
import s from './Label.module.css';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required,
  className,
  ...props
}) => {
  return (
    <label className={`${s.label} ${className ?? ''}`} {...props}>
      {children}
      {required && <span className={s.required}> *</span>}
    </label>
  );
};

export default Label;