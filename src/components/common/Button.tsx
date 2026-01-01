import React, { ButtonHTMLAttributes, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled,
    className = '',
    onClick,
    ...props
}) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = { x, y, id: Date.now() };
        setRipples([...ripples, newRipple]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);

        if (onClick) onClick(e);
    };

    const baseClasses = 'btn relative overflow-hidden';

    const variantClasses = {
        primary: 'btn-primary shadow-lg hover:shadow-primary transition-shadow',
        secondary: 'btn-secondary',
        danger: 'btn-danger shadow-lg hover:shadow-danger transition-shadow',
        success: 'btn-success shadow-lg hover:shadow-success transition-shadow',
        outline: 'btn-outline',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
    ].join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            onClick={handleClick}
            {...props}
        >
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full animate-ping"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '20px',
                        height: '20px',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                    }}
                />
            ))}
            {loading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
