import React from 'react';
import s from './Form.module.css';
import { Text } from '../../atoms/Text/Text';

interface FormProps {
  label?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export const Form: React.FC<FormProps> = ({ label, required, helper, error, children, htmlFor }) => {
  return (
    <div className={s.field} data-state={error ? 'error' : 'default'}>
      {label && (
        <label className={s.label} htmlFor={htmlFor}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {(error !== undefined || helper !== undefined) && (
        <Text size="xs" muted={!error}>
          {error ?? helper}
        </Text>
      )}
    </div>
  );
};

export default Form;
