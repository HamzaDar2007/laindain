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
            <h1 className="text-3xl font-bold text-gray-900">{t('nav.auditLogs')}</h1>

            <div className="card overflow-hidden">
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t('common.date')}</th>
                            <th>{t('common.user')}</th>
                            <th>{t('auditLogs.action')}</th>
                            <th>{t('auditLogs.entity')}</th>
                            <th>{t('auditLogs.details')}</th>
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
                                        <span className="font-medium text-gray-900">{log.user?.fullName || 'System'}</span>
                                        <span className="text-xs text-gray-500">{log.user?.email || ''}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-info uppercase tracking-wider text-[10px]">
                                        {log.action}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center text-sm">
                                        <span className="text-gray-900 font-medium">{log.entityType}</span>
                                        <span className="ml-1 text-gray-400 font-mono text-xs">({log.entityId.substring(0, 8)})</span>
                                    </div>
                                </td>
                                <td className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-600">
                                    {log.newValue ? JSON.stringify(log.newValue) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
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
