import { RootState } from '../index';

export const selectTrialBalance = (state: RootState) => state.reports.trialBalance;
export const selectGeneralLedger = (state: RootState) => state.reports.generalLedger;
export const selectProfitLoss = (state: RootState) => state.reports.profitLoss;
export const selectBalanceSheet = (state: RootState) => state.reports.balanceSheet;
export const selectCashFlow = (state: RootState) => state.reports.cashFlow;
export const selectReportsLoading = (state: RootState) => state.reports.isLoading;
export const selectReportsError = (state: RootState) => state.reports.error;
