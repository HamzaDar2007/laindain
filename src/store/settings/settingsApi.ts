import { apiClient } from '../common/apiHelper';
import { UpdateUserSettingsDto, UpdateTenantSettingsDto, UserSettings, TenantSettings } from './settingsTypes';

export const fetchUserSettings = async (): Promise<UserSettings> => {
    const response = await apiClient.get('/settings/user');
    return response.data;
};

export const fetchTenantSettings = async (): Promise<TenantSettings> => {
    const response = await apiClient.get('/settings/tenant');
    return response.data;
};

export const updateUserSettings = async (data: UpdateUserSettingsDto): Promise<UserSettings> => {
    const response = await apiClient.patch('/settings/user', data);
    return response.data;
};

export const updateTenantSettings = async (data: UpdateTenantSettingsDto): Promise<TenantSettings> => {
    const response = await apiClient.patch('/settings/tenant', data);
    return response.data;
};
