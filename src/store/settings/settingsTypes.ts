export interface UserSettings {
    id: string;
    userId: string;
    theme: 'light' | 'dark';
    language: 'en' | 'ur';
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    dateFormat: string;
    numberFormat: string;
    timezone: string;
}

export interface TenantSettings {
    id: string;
    tenantId: string;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    fiscalYearStart: string;
    currency: string;
    taxRate: number;
    logo?: string;
}

export interface SettingsState {
    userSettings: UserSettings | null;
    tenantSettings: TenantSettings | null;
    isLoading: boolean;
    error: string | null;
}

export interface UpdateUserSettingsDto {
    theme?: 'light' | 'dark';
    language?: 'en' | 'ur';
    notifications?: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
    };
    dateFormat?: string;
    numberFormat?: string;
    timezone?: string;
}

export interface UpdateTenantSettingsDto {
    companyName?: string;
    companyEmail?: string;
    companyPhone?: string;
    companyAddress?: string;
    fiscalYearStart?: string;
    currency?: string;
    taxRate?: number;
    logo?: string;
}
