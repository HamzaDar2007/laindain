import { createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../common/storeUtils';
import * as api from './settingsApi';
import { SettingsState, UpdateUserSettingsDto, UpdateTenantSettingsDto } from './settingsTypes';

const initialState: SettingsState = {
    userSettings: null,
    tenantSettings: null,
    isLoading: false,
    error: null,
};

export const fetchUserSettingsAsync = createAppAsyncThunk(
    'settings/fetchUser',
    async () => await api.fetchUserSettings()
);

export const fetchTenantSettingsAsync = createAppAsyncThunk(
    'settings/fetchTenant',
    async () => await api.fetchTenantSettings()
);

export const updateUserSettingsAsync = createAppAsyncThunk(
    'settings/updateUser',
    async (data: UpdateUserSettingsDto) => await api.updateUserSettings(data)
);

export const updateTenantSettingsAsync = createAppAsyncThunk(
    'settings/updateTenant',
    async (data: UpdateTenantSettingsDto) => await api.updateTenantSettings(data)
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserSettingsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserSettingsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userSettings = action.payload;
            })
            .addCase(fetchUserSettingsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch user settings';
            })
            .addCase(fetchTenantSettingsAsync.fulfilled, (state, action) => {
                state.tenantSettings = action.payload;
            })
            .addCase(updateUserSettingsAsync.fulfilled, (state, action) => {
                state.userSettings = action.payload;
            })
            .addCase(updateTenantSettingsAsync.fulfilled, (state, action) => {
                state.tenantSettings = action.payload;
            });
    },
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
