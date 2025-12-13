import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../common/storeUtils';
import * as api from './tenantUsersApi';
import { TenantUserState, InviteTenantUserDto, UpdateTenantUserRoleDto } from './tenantUsersTypes';

const initialState: TenantUserState = {
    tenantUsers: [],
    currentTenantUser: null,
    myTenants: [],
    isLoading: false,
    error: null,
};

export const fetchTenantUsersAsync = createAppAsyncThunk(
    'tenantUsers/fetchAll',
    async () => await api.fetchTenantUsers()
);

export const fetchTenantUserAsync = createAppAsyncThunk(
    'tenantUsers/fetchOne',
    async (id: string) => await api.fetchTenantUser(id)
);

export const inviteTenantUserAsync = createAppAsyncThunk(
    'tenantUsers/invite',
    async (data: InviteTenantUserDto) => await api.inviteTenantUser(data)
);

export const acceptInvitationAsync = createAppAsyncThunk(
    'tenantUsers/accept',
    async (invitationId: string) => await api.acceptInvitation(invitationId)
);

export const getMyTenantsAsync = createAppAsyncThunk(
    'tenantUsers/myTenants',
    async () => await api.getMyTenants()
);

export const updateTenantUserRoleAsync = createAppAsyncThunk(
    'tenantUsers/updateRole',
    async ({ id, data }: { id: string; data: UpdateTenantUserRoleDto }) =>
        await api.updateTenantUserRole(id, data)
);

export const removeTenantUserAsync = createAppAsyncThunk(
    'tenantUsers/remove',
    async (id: string) => {
        await api.removeTenantUser(id);
        return id;
    }
);

const tenantUsersSlice = createSlice({
    name: 'tenantUsers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTenantUsersAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTenantUsersAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tenantUsers = action.payload;
            })
            .addCase(fetchTenantUsersAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch tenant users';
            })
            .addCase(fetchTenantUserAsync.fulfilled, (state, action) => {
                state.currentTenantUser = action.payload;
            })
            .addCase(inviteTenantUserAsync.fulfilled, (state, action) => {
                state.tenantUsers.push(action.payload);
            })
            .addCase(getMyTenantsAsync.fulfilled, (state, action) => {
                state.myTenants = action.payload;
            })
            .addCase(updateTenantUserRoleAsync.fulfilled, (state, action) => {
                const index = state.tenantUsers.findIndex(u => u.id === action.payload.id);
                if (index !== -1) state.tenantUsers[index] = action.payload;
            })
            .addCase(removeTenantUserAsync.fulfilled, (state, action) => {
                state.tenantUsers = state.tenantUsers.filter(u => u.id !== action.payload);
            });
    },
});

export const { clearError } = tenantUsersSlice.actions;
export default tenantUsersSlice.reducer;
