export enum IntegrationType {
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
    QUICKBOOKS = 'quickbooks',
    XERO = 'xero',
    ZAPIER = 'zapier',
    SLACK = 'slack',
    EMAIL = 'email',
    WEBHOOK = 'webhook',
    API = 'api',
}

export enum IntegrationStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ERROR = 'error',
}

export interface Integration {
    id: string;
    tenantId: string;
    type: IntegrationType;
    name: string;
    description: string | null;
    status: IntegrationStatus;
    config: Record<string, any> | null;
    credentials: Record<string, any> | null;
    webhookUrl: string | null;
    apiKey: string | null;
    apiSecret: string | null;
    lastError: string | null;
    lastSyncAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateIntegrationDto {
    type: IntegrationType;
    name: string;
    description?: string;
    config?: Record<string, any>;
    credentials?: Record<string, any>;
    webhookUrl?: string;
    apiKey?: string;
    apiSecret?: string;
}

export interface UpdateIntegrationDto {
    name?: string;
    description?: string;
    config?: Record<string, any>;
    credentials?: Record<string, any>;
    webhookUrl?: string;
    apiKey?: string;
    apiSecret?: string;
}

export interface IntegrationsState {
    integrations: Integration[];
    currentIntegration: Integration | null;
    isLoading: boolean;
    error: string | null;
}
