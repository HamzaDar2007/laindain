import { RootState } from '../index';

export const selectAllTenantUsers = (state: RootState) => state.tenantUsers.tenantUsers;
export const selectCurrentTenantUser = (state: RootState) => state.tenantUsers.currentTenantUser;
export const selectMyTenants = (state: RootState) => state.tenantUsers.myTenants;
export const selectTenantUsersLoading = (state: RootState) => state.tenantUsers.isLoading;
export const selectTenantUsersError = (state: RootState) => state.tenantUsers.error;

export const selectActiveTenantUsers = (state: RootState) =>
    state.tenantUsers.tenantUsers.filter(u => u.status === 'active');

export const selectInvitedTenantUsers = (state: RootState) =>
    state.tenantUsers.tenantUsers.filter(u => u.status === 'invited');
