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
