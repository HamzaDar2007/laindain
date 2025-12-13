import { RootState } from '../index';

export const selectUserSettings = (state: RootState) => state.settings.userSettings;
export const selectTenantSettings = (state: RootState) => state.settings.tenantSettings;
export const selectSettingsLoading = (state: RootState) => state.settings.isLoading;
export const selectSettingsError = (state: RootState) => state.settings.error;
