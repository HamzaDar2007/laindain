import { apiClient } from '../common/apiHelper';
import { ReportFilter, TrialBalanceItem, GeneralLedgerItem } from './reportsTypes';

export const fetchTrialBalance = async (filter: ReportFilter): Promise<TrialBalanceItem[]> => {
    return apiClient.get<TrialBalanceItem[]>('/reports/trial-balance', { params: filter });
};

export const fetchGeneralLedger = async (accountId: string, filter: ReportFilter): Promise<GeneralLedgerItem[]> => {
    return apiClient.get<GeneralLedgerItem[]>(`/reports/general-ledger/${accountId}`, { params: filter });
};

export const fetchProfitLoss = async (filter: ReportFilter): Promise<any> => {
    return apiClient.get('/reports/profit-loss', { params: filter });
};

export const fetchBalanceSheet = async (asOfDate: string): Promise<any> => {
    return apiClient.get('/reports/balance-sheet', { params: { asOfDate } });
};

export const fetchCashFlow = async (filter: ReportFilter): Promise<any> => {
    return apiClient.get('/reports/cash-flow', { params: filter });
};

export const fetchVatReport = async (filter: ReportFilter): Promise<any> => {
    return apiClient.get('/reports/vat', { params: filter });
};

export const fetchCustomerReport = async (filter: ReportFilter): Promise<any> => {
    return apiClient.get('/reports/customers', { params: filter });
};

export const fetchDashboardCharts = async (months: number = 6): Promise<any> => {
    return apiClient.get('/reports/dashboard/charts', { params: { months } });
};

export const fetchExpensesByCategory = async (filter: ReportFilter): Promise<any> => {
    return apiClient.get('/reports/expenses/by-category', { params: filter });
};

// Excel Export Functions
export const exportVatReportExcel = async (filter: ReportFilter & { language: string }): Promise<Blob> => {
    const response = await apiClient.get('/reports/vat/export/excel', { 
        params: filter,
        responseType: 'blob'
    });
    return response as unknown as Blob;
};

export const exportProfitLossExcel = async (filter: ReportFilter & { language: string }): Promise<Blob> => {
    const response = await apiClient.get('/reports/profit-loss/export/excel', { 
        params: filter,
        responseType: 'blob'
    });
    return response as unknown as Blob;
};

export const exportBalanceSheetExcel = async (params: { asOfDate: string; language: string }): Promise<Blob> => {
    const response = await apiClient.get('/reports/balance-sheet/export/excel', { 
        params,
        responseType: 'blob'
    });
    return response as unknown as Blob;
};

export const exportExpensesByCategoryExcel = async (filter: ReportFilter & { language: string }): Promise<Blob> => {
    const response = await apiClient.get('/reports/expenses/by-category/export/excel', { 
        params: filter,
        responseType: 'blob'
    });
    return response as unknown as Blob;
};
