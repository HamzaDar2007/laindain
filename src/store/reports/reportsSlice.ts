import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../common/storeUtils';
import * as api from './reportsApi';
import { ReportState, ReportFilter } from './reportsTypes';

const initialState: ReportState = {
    trialBalance: [],
    generalLedger: [],
    profitLoss: null,
    balanceSheet: null,
    cashFlow: null,
    isLoading: false,
    error: null,
};

export const fetchTrialBalanceAsync = createAppAsyncThunk(
    'reports/trialBalance',
    async (filter: ReportFilter) => await api.fetchTrialBalance(filter)
);

export const fetchGeneralLedgerAsync = createAppAsyncThunk(
    'reports/generalLedger',
    async ({ accountId, filter }: { accountId: string; filter: ReportFilter }) =>
        await api.fetchGeneralLedger(accountId, filter)
);

export const fetchProfitLossAsync = createAppAsyncThunk(
    'reports/profitLoss',
    async (filter: ReportFilter) => await api.fetchProfitLoss(filter)
);

export const fetchBalanceSheetAsync = createAppAsyncThunk(
    'reports/balanceSheet',
    async (asOfDate: string) => await api.fetchBalanceSheet(asOfDate)
);

export const fetchCashFlowAsync = createAppAsyncThunk(
    'reports/cashFlow',
    async (filter: ReportFilter) => await api.fetchCashFlow(filter)
);

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrialBalanceAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTrialBalanceAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.trialBalance = action.payload;
            })
            .addCase(fetchTrialBalanceAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch trial balance';
            })
            .addCase(fetchGeneralLedgerAsync.fulfilled, (state, action) => {
                state.generalLedger = action.payload;
            })
            .addCase(fetchProfitLossAsync.fulfilled, (state, action) => {
                state.profitLoss = action.payload;
            })
            .addCase(fetchBalanceSheetAsync.fulfilled, (state, action) => {
                state.balanceSheet = action.payload;
            })
            .addCase(fetchCashFlowAsync.fulfilled, (state, action) => {
                state.cashFlow = action.payload;
            });
    },
});

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;
