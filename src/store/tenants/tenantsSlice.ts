import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantsState, Tenant, CreateTenantDto } from './tenantsTypes';
import { createAppAsyncThunk } from '../common/storeUtils';
import { tenantsApi } from './tenantsApi';

const initialState: TenantsState = {
    tenants: [],
    currentTenant: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchTenantsAsync = createAppAsyncThunk(
    'tenants/fetchAll',
    async () => {
        return await tenantsApi.fetchTenants();
    }
);

export const createTenantAsync = createAppAsyncThunk(
    'tenants/create',
    async (data: CreateTenantDto) => {
        return await tenantsApi.createTenant(data);
    }
);

export const updateTenantAsync = createAppAsyncThunk(
    'tenants/update',
    async ({ id, data }: { id: string; data: Partial<CreateTenantDto> }) => {
        return await tenantsApi.updateTenant(id, data);
    }
);

export const deleteTenantAsync = createAppAsyncThunk(
    'tenants/delete',
    async (id: string) => {
        await tenantsApi.deleteTenant(id);
        return id;
    }
);

const tenantsSlice = createSlice({
    name: 'tenants',
    initialState,
    reducers: {
        setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
            state.currentTenant = action.payload;
            localStorage.setItem('currentTenantId', action.payload.id);
        },
        clearCurrentTenant: (state) => {
            state.currentTenant = null;
            localStorage.removeItem('currentTenantId');
        },
    },
    extraReducers: (builder) => {
        // Fetch tenants
        builder.addCase(fetchTenantsAsync.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchTenantsAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tenants = action.payload;

            // Auto-select first tenant if none selected
            if (!state.currentTenant && action.payload.length > 0) {
                state.currentTenant = action.payload[0];
                localStorage.setItem('currentTenantId', action.payload[0].id);
            }
        });
        builder.addCase(fetchTenantsAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create tenant
        builder.addCase(createTenantAsync.fulfilled, (state, action) => {
            state.tenants.push(action.payload);
            state.currentTenant = action.payload;
            localStorage.setItem('currentTenantId', action.payload.id);
        });

        // Update tenant
        builder.addCase(updateTenantAsync.fulfilled, (state, action) => {
            const index = state.tenants.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) {
                state.tenants[index] = action.payload;
            }
            if (state.currentTenant?.id === action.payload.id) {
                state.currentTenant = action.payload;
            }
        });

        // Delete tenant
        builder.addCase(deleteTenantAsync.fulfilled, (state, action) => {
            state.tenants = state.tenants.filter((t) => t.id !== action.payload);
            if (state.currentTenant?.id === action.payload) {
                state.currentTenant = state.tenants[0] || null;
                if (state.currentTenant) {
                    localStorage.setItem('currentTenantId', state.currentTenant.id);
                } else {
                    localStorage.removeItem('currentTenantId');
                }
            }
        });
    },
});

export const { setCurrentTenant, clearCurrentTenant } = tenantsSlice.actions;
export default tenantsSlice.reducer;
