import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from './authTypes';
import { createAppAsyncThunk } from '../common/storeUtils';
import { authApi } from './authApi';

const savedUser = localStorage.getItem('authUser');
const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: localStorage.getItem('authToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('authToken'),
    isLoading: false,
    error: null,
};

// Async thunks
export const loginAsync = createAppAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials) => {
        const response = await authApi.login(credentials);
        localStorage.setItem('authToken', response.access_token);
        if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
        }
        return response;
    }
);

export const registerAsync = createAppAsyncThunk(
    'auth/register',
    async (data: RegisterData) => {
        return await authApi.register(data);
    }
);

export const refreshTokenAsync = createAppAsyncThunk(
    'auth/refreshToken',
    async (refreshToken: string) => {
        const response = await authApi.refreshToken(refreshToken);
        localStorage.setItem('authToken', response.access_token);
        if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
        }
        return response;
    }
);

export const updateProfileAsync = createAppAsyncThunk(
    'auth/updateProfile',
    async ({ id, data }: { id: string; data: any }) => {
        return await authApi.updateProfile(id, data);
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('authUser');
            localStorage.removeItem('currentTenantId');
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem('authUser', JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginAsync.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            state.refreshToken = action.payload.refreshToken || null;
            state.isAuthenticated = true;
            localStorage.setItem('authUser', JSON.stringify(action.payload.user));
        });
        builder.addCase(loginAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(registerAsync.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerAsync.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(registerAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Refresh Token
        builder.addCase(refreshTokenAsync.fulfilled, (state, action) => {
            state.token = action.payload.access_token;
            state.refreshToken = action.payload.refreshToken || null;
        });

        // Update Profile
        builder.addCase(updateProfileAsync.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateProfileAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            localStorage.setItem('authUser', JSON.stringify(action.payload));
        });
        builder.addCase(updateProfileAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
