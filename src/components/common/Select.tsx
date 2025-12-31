import React, { SelectHTMLAttributes } from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options?: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
    label,
    error,
    helperText,
    options,
    placeholder,
    fullWidth = true,
    className = '',
    children,
    ...props
}) => {
    const containerClasses = [
        fullWidth ? 'w-full' : '',
    ].join(' ');

    const selectClasses = [
        'input appearance-none bg-none pr-10', // Remove default arrow and add padding for custom one
        error ? 'input-error animate-shake' : '',
        className,
    ].join(' ');

    return (
        <div className={containerClasses}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                    {props.required && <span className="text-danger-500 ml-1 decoration-none">*</span>}
                </label>
            )}
            <div className="relative">
                <select className={selectClasses} {...props}>
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options ? (
                        options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))
                    ) : (
                        children
                    )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <div className="flex items-center mt-1 text-danger-600 dark:text-danger-400 text-sm animate-fade-in">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    );
};

export default Select;
