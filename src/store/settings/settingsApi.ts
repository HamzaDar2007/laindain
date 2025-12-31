import { apiClient } from '../common/apiHelper';
import { UpdateUserSettingsDto, UpdateTenantSettingsDto, UserSettings, TenantSettings } from './settingsTypes';

export const fetchUserSettings = async (): Promise<UserSettings> => {
    return apiClient.get<UserSettings>('/settings/user');
};

export const fetchTenantSettings = async (): Promise<TenantSettings> => {
    return apiClient.get<TenantSettings>('/settings/tenant');
};

export const updateUserSettings = async (data: UpdateUserSettingsDto): Promise<UserSettings> => {
    return apiClient.patch<UserSettings>('/settings/user', data);
};

export const updateTenantSettings = async (data: UpdateTenantSettingsDto): Promise<TenantSettings> => {
    return apiClient.patch<TenantSettings>('/settings/tenant', data);
};
