import { apiClient } from '../common/apiHelper';
import { LoginCredentials, RegisterData, AuthResponse, RegisterResponse } from './authTypes';

export const authApi = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>('/auth/login', credentials);
    },

    async register(data: RegisterData): Promise<RegisterResponse> {
        return apiClient.post<RegisterResponse>('/auth/register', data);
    },

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    },
};
