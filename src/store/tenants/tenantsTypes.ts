export interface Tenant {
    id: string;
    name: string;
    domain?: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTenantDto {
    name: string;
    domain?: string;
    description?: string;
}

export interface TenantsState {
    tenants: Tenant[];
    currentTenant: Tenant | null;
    isLoading: boolean;
    error: string | null;
}
