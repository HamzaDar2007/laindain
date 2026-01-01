import React, { InputHTMLAttributes, useState } from 'react';

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
    required,
    className = '',
    value,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== '';

    return (
        <div className="relative">
            <div className="relative">
                <input
                    className={`
                        peer w-full px-4 pt-6 pb-2 bg-white dark:bg-gray-800 
                        border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20'}
                        rounded-lg text-gray-900 dark:text-white placeholder-transparent
                        focus:outline-none focus:ring-2 transition-all duration-200
                        hover:border-gray-300 dark:hover:border-gray-600
                        ${className}
                    `}
                    placeholder={label || ''}
                    value={value}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {label && (
                    <label
                        className={`
                            absolute left-4 transition-all duration-200 pointer-events-none
                            ${isFocused || hasValue
                                ? 'top-2 text-xs text-primary-600 dark:text-primary-400'
                                : 'top-4 text-sm text-gray-500 dark:text-gray-400'
                            }
                        `}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center animate-slide-up">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    );
};

export default Input;
