import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../common/storeUtils';
import * as api from './invoicesApi';
import { InvoiceState, CreateInvoiceDto, UpdateInvoiceDto } from './invoicesTypes';

const initialState: InvoiceState = {
    invoices: [],
    currentInvoice: null,
    isLoading: false,
    error: null,
};

export const fetchInvoicesAsync = createAppAsyncThunk(
    'invoices/fetchAll',
    async () => await api.fetchInvoices()
);

export const fetchInvoiceAsync = createAppAsyncThunk(
    'invoices/fetchOne',
    async (id: string) => await api.fetchInvoice(id)
);

export const createInvoiceAsync = createAppAsyncThunk(
    'invoices/create',
    async (data: CreateInvoiceDto) => await api.createInvoice(data)
);

export const updateInvoiceAsync = createAppAsyncThunk(
    'invoices/update',
    async ({ id, data }: { id: string; data: UpdateInvoiceDto }) => await api.updateInvoice(id, data)
);

export const markInvoiceAsSentAsync = createAppAsyncThunk(
    'invoices/markAsSent',
    async (id: string) => await api.postInvoice(id) // keeping postInvoice name in api for now
);

export const markInvoiceAsPaidAsync = createAppAsyncThunk(
    'invoices/markAsPaid',
    async (id: string) => await api.updateInvoice(id, { status: 'paid' } as any) // Backend paid endpoint exists? 
);

export const deleteInvoiceAsync = createAppAsyncThunk(
    'invoices/delete',
    async (id: string) => {
        await api.deleteInvoice(id);
        return id;
    }
);

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoicesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInvoicesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.invoices = action.payload;
            })
            .addCase(fetchInvoicesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch invoices';
            })
            .addCase(fetchInvoiceAsync.fulfilled, (state, action) => {
                state.currentInvoice = action.payload;
            })
            .addCase(createInvoiceAsync.fulfilled, (state, action) => {
                state.invoices.push(action.payload);
            })
            .addCase(updateInvoiceAsync.fulfilled, (state, action) => {
                const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
                if (index !== -1) state.invoices[index] = action.payload;
            })
            .addCase(markInvoiceAsSentAsync.fulfilled, (state, action) => {
                const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
                if (index !== -1) state.invoices[index] = action.payload;
            })
            .addCase(markInvoiceAsPaidAsync.fulfilled, (state, action) => {
                const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
                if (index !== -1) state.invoices[index] = action.payload;
            })
            .addCase(deleteInvoiceAsync.fulfilled, (state, action) => {
                state.invoices = state.invoices.filter(inv => inv.id !== action.payload);
            });
    },
});

export const { clearError } = invoicesSlice.actions;
export default invoicesSlice.reducer;
