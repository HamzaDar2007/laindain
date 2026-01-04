import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token and tenant ID
        this.client.interceptors.request.use(
            (config) => {
                // Add auth token
                const token = localStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add tenant ID
                const tenantId = localStorage.getItem('currentTenantId');
                if (tenantId) {
                    config.headers['x-tenant-id'] = tenantId;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling and token refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                if (error.response?.status === 409 && originalRequest.method === 'get' && !originalRequest._retry) {
                    originalRequest._retry = true;
                    // Wait 500ms and retry to bypass backend race condition
                    await new Promise(resolve => setTimeout(resolve, 500));
                    return this.client(originalRequest);
                }

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const refreshToken = localStorage.getItem('refreshToken');

                    if (refreshToken) {
                        try {
                            // Call refresh endpoint directly to avoid circular dependency
                            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

                            if (response.data && response.data.access_token) {
                                localStorage.setItem('authToken', response.data.access_token);
                                if (response.data.refreshToken) {
                                    localStorage.setItem('refreshToken', response.data.refreshToken);
                                }

                                // Update authorization header for the original request
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                                }

                                // Update default headers for future requests
                                this.client.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

                                return this.client(originalRequest);
                            }
                        } catch (refreshError) {
                            // Refresh failed - logout
                            this.handleLogout();
                        }
                    } else {
                        // No refresh token - logout
                        this.handleLogout();
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();

// Helper function to handle API errors
export function handleApiError(error: any): string {
    if (error.response) {
        // Server responded with error
        return error.response.data?.message || 'An error occurred';
    } else if (error.request) {
        // Request made but no response
        return 'Network error. Please check your connection.';
    } else {
        // Something else happened
        return error.message || 'An unexpected error occurred';
    }
}
