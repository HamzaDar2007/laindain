import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as rolesApi from './rolesApi';
import { CreateRoleDto, Role, RolesState } from './rolesTypes';

const initialState: RolesState = {
    roles: [],
    isLoading: false,
    error: null,
};

export const fetchRolesAsync = createAsyncThunk(
    'roles/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await rolesApi.fetchRoles();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
        }
    }
);

export const createRoleAsync = createAsyncThunk(
    'roles/create',
    async (data: CreateRoleDto, { rejectWithValue }) => {
        try {
            return await rolesApi.createRole(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create role');
        }
    }
);

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRolesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRolesAsync.fulfilled, (state, action: PayloadAction<Role[]>) => {
                state.isLoading = false;
                state.roles = action.payload;
            })
            .addCase(fetchRolesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createRoleAsync.fulfilled, (state, action: PayloadAction<Role>) => {
                state.roles.unshift(action.payload);
            });
    },
});

export default rolesSlice.reducer;
