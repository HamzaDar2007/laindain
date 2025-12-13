import { RootState } from '../index';

export const selectAllTenants = (state: RootState) => state.tenants.tenants;
export const selectCurrentTenant = (state: RootState) => state.tenants.currentTenant;
export const selectTenantsLoading = (state: RootState) => state.tenants.isLoading;
export const selectTenantsError = (state: RootState) => state.tenants.error;
