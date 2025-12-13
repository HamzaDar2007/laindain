import { apiClient } from '../common/apiHelper';
import { Tenant, CreateTenantDto } from './tenantsTypes';

export const tenantsApi = {
    async fetchTenants(): Promise<Tenant[]> {
        return apiClient.get<Tenant[]>('/tenants');
    },

    async createTenant(data: CreateTenantDto): Promise<Tenant> {
        return apiClient.post<Tenant>('/tenants', data);
    },

    async getTenant(id: string): Promise<Tenant> {
        return apiClient.get<Tenant>(`/tenants/${id}`);
    },

    async updateTenant(id: string, data: Partial<CreateTenantDto>): Promise<Tenant> {
        return apiClient.patch<Tenant>(`/tenants/${id}`, data);
    },

    async deleteTenant(id: string): Promise<void> {
        return apiClient.delete<void>(`/tenants/${id}`);
    },
};
