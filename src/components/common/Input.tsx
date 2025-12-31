import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    fullWidth = true,
    className = '',
    ...props
}) => {
    const inputClasses = [
        'input transition-all duration-200',
        error ? 'input-error animate-shake' : '',
        fullWidth ? 'w-full' : '',
        className,
    ].join(' ');

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {props.required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <input className={inputClasses} {...props} />
            {error && (
                <p className="mt-1 text-sm text-danger-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default Input;
