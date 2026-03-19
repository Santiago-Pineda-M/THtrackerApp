import React, { useId, cloneElement } from 'react';
import s from './FormField.module.css';
import { Text } from '../../atoms/Text/Text';

type FieldControlProps = {
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  state?: 'default' | 'error' | 'success';
};

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactElement<FieldControlProps>;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  helper,
  error,
  children,
  id,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const messageId = error
    ? `${inputId}-error`
    : helper
    ? `${inputId}-helper`
    : undefined;

  const childWithProps = cloneElement(children, {
    id: inputId,
    'aria-invalid': !!error,
    'aria-describedby': messageId,
    state: error ? 'error' : children.props.state,
  });

  return (
    <div className={s.field} data-state={error ? 'error' : 'default'}>
      {label && (
        <label className={s.label} htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      {childWithProps}

      {(error || helper) && (
        <Text
          id={messageId}
          size="xs"
          muted={!error}
          className={error ? s.error : s.helper}
        >
          {error ?? helper}
        </Text>
      )}
    </div>
  );
};

export default FormField;