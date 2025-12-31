import { apiClient } from '../common/apiHelper';
import { AuditLog, AuditLogFilters } from './auditLogsTypes';

export const fetchAuditLogs = async (filters?: AuditLogFilters): Promise<AuditLog[]> => {
    return await apiClient.get('/audit-logs', { params: filters });
};

export const fetchAuditLogStatistics = async (): Promise<any> => {
    return await apiClient.get('/audit-logs/statistics');
};

export const fetchAuditLogsByDateRange = async (startDate: string, endDate: string): Promise<AuditLog[]> => {
    return await apiClient.get('/audit-logs/by-date-range', {
        params: { startDate, endDate },
    });
};

export const fetchAuditLogsByUser = async (userId: string): Promise<AuditLog[]> => {
    return await apiClient.get(`/audit-logs/by-user/${userId}`);
};

export const fetchAuditLogById = async (id: string): Promise<AuditLog> => {
    return await apiClient.get(`/audit-logs/${id}`);
};
