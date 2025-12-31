import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    footer,
    className = '',
    padding = 'md',
    hover = false,
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const cardClasses = [
        'card',
        paddingClasses[padding],
        hover ? 'hover:shadow-floating hover:-translate-y-1 cursor-pointer' : '',
        className,
    ].join(' ');

    return (
        <div className={cardClasses}>
            {(title || subtitle) && (
                <div className="mb-4">
                    {title && (
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    )}
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                    )}
                </div>
            )}

            <div>{children}</div>

            {footer && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
