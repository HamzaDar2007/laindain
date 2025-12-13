import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../common/storeUtils';
import * as api from './integrationsApi';
import { IntegrationsState, CreateIntegrationDto, UpdateIntegrationDto } from './integrationsTypes';

const initialState: IntegrationsState = {
    integrations: [],
    currentIntegration: null,
    isLoading: false,
    error: null,
};

export const fetchIntegrationsAsync = createAppAsyncThunk(
    'integrations/fetchAll',
    async () => await api.fetchIntegrations()
);

export const fetchIntegrationAsync = createAppAsyncThunk(
    'integrations/fetchOne',
    async (id: string) => await api.fetchIntegration(id)
);

export const createIntegrationAsync = createAppAsyncThunk(
    'integrations/create',
    async (data: CreateIntegrationDto) => await api.createIntegration(data)
);

export const updateIntegrationAsync = createAppAsyncThunk(
    'integrations/update',
    async ({ id, data }: { id: string; data: UpdateIntegrationDto }) => await api.updateIntegration(id, data)
);

export const activateIntegrationAsync = createAppAsyncThunk(
    'integrations/activate',
    async (id: string) => await api.activateIntegration(id)
);

export const deactivateIntegrationAsync = createAppAsyncThunk(
    'integrations/deactivate',
    async (id: string) => await api.deactivateIntegration(id)
);

export const testConnectionAsync = createAppAsyncThunk(
    'integrations/testConnection',
    async (id: string) => await api.testConnection(id)
);

export const deleteIntegrationAsync = createAppAsyncThunk(
    'integrations/delete',
    async (id: string) => {
        await api.deleteIntegration(id);
        return id;
    }
);

const integrationsSlice = createSlice({
    name: 'integrations',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchIntegrationsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchIntegrationsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.integrations = action.payload;
            })
            .addCase(fetchIntegrationsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch integrations';
            })
            // Fetch one
            .addCase(fetchIntegrationAsync.fulfilled, (state, action) => {
                state.currentIntegration = action.payload;
            })
            // Create
            .addCase(createIntegrationAsync.fulfilled, (state, action) => {
                state.integrations.push(action.payload);
            })
            // Update
            .addCase(updateIntegrationAsync.fulfilled, (state, action) => {
                const index = state.integrations.findIndex(i => i.id === action.payload.id);
                if (index !== -1) state.integrations[index] = action.payload;
            })
            // Activate
            .addCase(activateIntegrationAsync.fulfilled, (state, action) => {
                const index = state.integrations.findIndex(i => i.id === action.payload.id);
                if (index !== -1) state.integrations[index] = action.payload;
            })
            // Deactivate
            .addCase(deactivateIntegrationAsync.fulfilled, (state, action) => {
                const index = state.integrations.findIndex(i => i.id === action.payload.id);
                if (index !== -1) state.integrations[index] = action.payload;
            })
            // Delete
            .addCase(deleteIntegrationAsync.fulfilled, (state, action) => {
                state.integrations = state.integrations.filter(i => i.id !== action.payload);
            });
    },
});

export const { clearError } = integrationsSlice.actions;
export default integrationsSlice.reducer;
