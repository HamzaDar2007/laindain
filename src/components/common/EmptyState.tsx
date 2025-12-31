import React from 'react';
import Button from './Button';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    actionLabel,
    onAction,
    icon
}) => {

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-full p-6 mb-4">
                {icon || (
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
