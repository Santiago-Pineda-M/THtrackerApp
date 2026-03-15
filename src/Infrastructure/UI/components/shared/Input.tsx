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
                <label htmlFor={id} className="label mb-2 block text-text-muted font-bold uppercase tracking-wider text-xs">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`input glass focus:border-neon-cyan focus:shadow-neon ${error ? 'border-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <span className="text-xs text-error mt-2 block font-medium">
                    {error}
                </span>
            )}
        </div>
    );
};
