import React from 'react';

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    loading?: boolean;
    emptyMessage?: string;
    className?: string;
}

function Table<T extends Record<string, any>>({
    data,
    columns,
    onRowClick,
    loading = false,
    emptyMessage = 'No data available',
    className = '',
}: TableProps<T>) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-100 dark:border-gray-700"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading data...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No items found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`table-container bg-white dark:bg-gray-800 shadow-card ${className}`}>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} className="whitespace-nowrap bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
                                    <div className="flex items-center space-x-1">
                                        <span>{column.header}</span>
                                        {column.sortable && (
                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                onClick={() => onRowClick?.(item)}
                                className={`
                                    group transition-colors duration-200
                                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-700/30' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50'}
                                `}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                        {column.render
                                            ? column.render(item)
                                            : item[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
