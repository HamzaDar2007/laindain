export interface AuditLog {
    id: string;
    companyId: string;
    userId: string;
    user?: {
        fullName: string;
        email: string;
    };
    action: string;
    entityType: string;
    entityId: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export interface AuditLogsState {
    logs: AuditLog[];
    statistics: any;
    isLoading: boolean;
    error: string | null;
}

export interface AuditLogFilters {
    action?: string;
    entityType?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
}
