import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as auditLogsApi from './auditLogsApi';
import { AuditLog, AuditLogsState, AuditLogFilters } from './auditLogsTypes';

const initialState: AuditLogsState = {
    logs: [],
    statistics: null,
    isLoading: false,
    error: null,
};

export const fetchAuditLogsAsync = createAsyncThunk(
    'auditLogs/fetchAll',
    async (filters: AuditLogFilters | undefined, { rejectWithValue }) => {
        try {
            return await auditLogsApi.fetchAuditLogs(filters);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
        }
    }
);

export const fetchAuditLogStatisticsAsync = createAsyncThunk(
    'auditLogs/fetchStatistics',
    async (_, { rejectWithValue }) => {
        try {
            return await auditLogsApi.fetchAuditLogStatistics();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit log statistics');
        }
    }
);

const auditLogsSlice = createSlice({
    name: 'auditLogs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAuditLogsAsync.fulfilled, (state, action: PayloadAction<AuditLog[]>) => {
                state.isLoading = false;
                state.logs = action.payload;
            })
            .addCase(fetchAuditLogsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAuditLogStatisticsAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.statistics = action.payload;
            });
    },
});

export default auditLogsSlice.reducer;
