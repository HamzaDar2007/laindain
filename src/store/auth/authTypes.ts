export interface User {
    id: string;
    email: string;
    fullName: string;
    companyId: string;
    roles?: string[];
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    countryCode: string;
    phone?: string;
    trn?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refreshToken?: string;
}

export interface RegisterResponse {
    message: string;
    user: User;
    company: any;
}
