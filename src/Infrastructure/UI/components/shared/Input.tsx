import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    id,
    className = '',
    ...props
}) => {
    return (
        <div className="input-group">
            {label && (
                <label htmlFor={id} className="label">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`input ${error ? 'border-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <span className="text-xs text-error mt-1 text-left">
                    {error}
                </span>
            )}
        </div>
    );
};
