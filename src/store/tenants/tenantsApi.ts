import { apiClient } from '../common/apiHelper';
import { Tenant, CreateTenantDto } from './tenantsTypes';

export const tenantsApi = {
    async fetchTenants(): Promise<Tenant[]> {
        return apiClient.get<Tenant[]>('/companies');
    },

    async createTenant(data: CreateTenantDto): Promise<Tenant> {
        return apiClient.post<Tenant>('/companies', data);
    },

    async getTenant(id: string): Promise<Tenant> {
        return apiClient.get<Tenant>(`/companies/${id}`);
    },

    async updateTenant(id: string, data: Partial<CreateTenantDto>): Promise<Tenant> {
        return apiClient.patch<Tenant>(`/companies/${id}`, data);
    },

    async deleteTenant(id: string): Promise<void> {
        return apiClient.delete<void>(`/companies/${id}`);
    },

    async getStatistics(): Promise<any> {
        return apiClient.get('/companies/statistics');
    },

    async getCompanyStats(id: string): Promise<any> {
        return apiClient.get(`/companies/${id}/stats`);
    },

    async activateCompany(id: string): Promise<Tenant> {
        return apiClient.patch<Tenant>(`/companies/${id}/activate`, {});
    },

    async deactivateCompany(id: string): Promise<Tenant> {
        return apiClient.patch<Tenant>(`/companies/${id}/deactivate`, {});
    },
};
