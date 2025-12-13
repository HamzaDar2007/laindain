import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../common/storeUtils';
import * as api from './billingApi';
import { BillingState, UpdateSubscriptionDto } from './billingTypes';

const initialState: BillingState = {
    subscription: null,
    transactions: [],
    isLoading: false,
    error: null,
};

export const fetchSubscriptionAsync = createAppAsyncThunk(
    'billing/fetchSubscription',
    async () => await api.fetchSubscription()
);

export const updateSubscriptionAsync = createAppAsyncThunk(
    'billing/updateSubscription',
    async (data: UpdateSubscriptionDto) => await api.updateSubscription(data)
);

export const cancelSubscriptionAsync = createAppAsyncThunk(
    'billing/cancelSubscription',
    async () => await api.cancelSubscription()
);

export const fetchTransactionsAsync = createAppAsyncThunk(
    'billing/fetchTransactions',
    async () => await api.fetchTransactions()
);

const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch subscription
            .addCase(fetchSubscriptionAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subscription = action.payload;
            })
            .addCase(fetchSubscriptionAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch subscription';
            })
            // Update subscription
            .addCase(updateSubscriptionAsync.fulfilled, (state, action) => {
                state.subscription = action.payload;
            })
            // Cancel subscription
            .addCase(cancelSubscriptionAsync.fulfilled, (state, action) => {
                state.subscription = action.payload;
            })
            // Fetch transactions
            .addCase(fetchTransactionsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactionsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch transactions';
            });
    },
});

export const { clearError } = billingSlice.actions;
export default billingSlice.reducer;
