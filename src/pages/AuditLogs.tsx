import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchAuditLogsAsync } from '../store/audit-logs/auditLogsSlice';

const AuditLogs: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { logs, isLoading } = useSelector((state: RootState) => state.auditLogs);

    useEffect(() => {
        dispatch(fetchAuditLogsAsync() as any);
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('nav.auditLogs')}</h1>

            <div className="card overflow-hidden">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.date')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.user')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('auditLogs.action')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('auditLogs.entity')}</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('auditLogs.details')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td className="text-sm text-gray-500 whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900 dark:text-white">{log.user?.fullName || 'System'}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{log.user?.email || ''}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-info uppercase tracking-wider text-[10px]">
                                        {log.action}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center text-sm">
                                        <span className="text-slate-900 dark:text-white font-medium">{log.entityType}</span>
                                        <span className="ml-1 text-slate-400 dark:text-slate-500 font-mono text-xs">({log.entityId.substring(0, 8)})</span>
                                    </div>
                                </td>
                                <td className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                    {log.newValue ? JSON.stringify(log.newValue) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No activity logs found.
                    </div>
                )}
                {isLoading && (
                    <div className="text-center py-12 text-gray-500">
                        {t('common.loading')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
