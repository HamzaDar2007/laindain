import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../common/storeUtils';
import * as api from './paymentsApi';
import { PaymentState, CreatePaymentDto, UpdatePaymentDto } from './paymentsTypes';

const initialState: PaymentState = {
    payments: [],
    currentPayment: null,
    isLoading: false,
    error: null,
};

export const fetchPaymentsAsync = createAppAsyncThunk(
    'payments/fetchAll',
    async () => await api.fetchPayments()
);

export const fetchPaymentAsync = createAppAsyncThunk(
    'payments/fetchOne',
    async (id: string) => await api.fetchPayment(id)
);

export const createPaymentAsync = createAppAsyncThunk(
    'payments/create',
    async (data: CreatePaymentDto) => await api.createPayment(data)
);

export const updatePaymentAsync = createAppAsyncThunk(
    'payments/update',
    async ({ id, data }: { id: string; data: UpdatePaymentDto }) => await api.updatePayment(id, data)
);

export const confirmPaymentAsync = createAppAsyncThunk(
    'payments/confirm',
    async (id: string) => await api.confirmPayment(id)
);

export const cancelPaymentAsync = createAppAsyncThunk(
    'payments/cancel',
    async (id: string) => await api.cancelPayment(id)
);

export const deletePaymentAsync = createAppAsyncThunk(
    'payments/delete',
    async (id: string) => {
        await api.deletePayment(id);
        return id;
    }
);

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPaymentsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPaymentsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch payments';
            })
            .addCase(fetchPaymentAsync.fulfilled, (state, action) => {
                state.currentPayment = action.payload;
            })
            .addCase(createPaymentAsync.fulfilled, (state, action) => {
                state.payments.push(action.payload);
            })
            .addCase(updatePaymentAsync.fulfilled, (state, action) => {
                const index = state.payments.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.payments[index] = action.payload;
            })
            .addCase(confirmPaymentAsync.fulfilled, (state, action) => {
                const index = state.payments.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.payments[index] = action.payload;
            })
            .addCase(cancelPaymentAsync.fulfilled, (state, action) => {
                const index = state.payments.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.payments[index] = action.payload;
            })
            .addCase(deletePaymentAsync.fulfilled, (state, action) => {
                state.payments = state.payments.filter(p => p.id !== action.payload);
            });
    },
});

export const { clearError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
