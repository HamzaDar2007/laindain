import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../common/storeUtils';
import * as api from './voucherTypesApi';
import { VoucherTypeState, CreateVoucherTypeDto, UpdateVoucherTypeDto } from './voucherTypesTypes';

const initialState: VoucherTypeState = {
    voucherTypes: [],
    currentVoucherType: null,
    isLoading: false,
    error: null,
};

export const fetchVoucherTypesAsync = createAppAsyncThunk(
    'voucherTypes/fetchAll',
    async () => {
        return await api.fetchVoucherTypes();
    }
);

export const fetchVoucherTypeAsync = createAppAsyncThunk(
    'voucherTypes/fetchOne',
    async (id: string) => {
        return await api.fetchVoucherType(id);
    }
);

export const createVoucherTypeAsync = createAppAsyncThunk(
    'voucherTypes/create',
    async (data: CreateVoucherTypeDto) => {
        return await api.createVoucherType(data);
    }
);

export const updateVoucherTypeAsync = createAppAsyncThunk(
    'voucherTypes/update',
    async ({ id, data }: { id: string; data: UpdateVoucherTypeDto }) => {
        return await api.updateVoucherType(id, data);
    }
);

export const deleteVoucherTypeAsync = createAppAsyncThunk(
    'voucherTypes/delete',
    async (id: string) => {
        await api.deleteVoucherType(id);
        return id;
    }
);

const voucherTypesSlice = createSlice({
    name: 'voucherTypes',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchVoucherTypesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchVoucherTypesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.voucherTypes = action.payload;
            })
            .addCase(fetchVoucherTypesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch voucher types';
            })
            // Fetch one
            .addCase(fetchVoucherTypeAsync.fulfilled, (state, action) => {
                state.currentVoucherType = action.payload;
            })
            // Create
            .addCase(createVoucherTypeAsync.fulfilled, (state, action) => {
                state.voucherTypes.push(action.payload);
            })
            // Update
            .addCase(updateVoucherTypeAsync.fulfilled, (state, action) => {
                const index = state.voucherTypes.findIndex(vt => vt.id === action.payload.id);
                if (index !== -1) {
                    state.voucherTypes[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteVoucherTypeAsync.fulfilled, (state, action) => {
                // Removed debug logs
                state.voucherTypes = state.voucherTypes.filter(vt => vt.id !== action.payload);
            });
    },
});

export const { clearError } = voucherTypesSlice.actions;
export default voucherTypesSlice.reducer;
