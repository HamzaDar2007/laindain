import { apiClient } from '../common/apiHelper';
import { Integration, CreateIntegrationDto, UpdateIntegrationDto } from './integrationsTypes';

export const fetchIntegrations = async (): Promise<Integration[]> => {
    return apiClient.get<Integration[]>('/integrations');
};

export const fetchIntegration = async (id: string): Promise<Integration> => {
    return apiClient.get<Integration>(`/integrations/${id}`);
};

export const createIntegration = async (data: CreateIntegrationDto): Promise<Integration> => {
    return apiClient.post<Integration>('/integrations', data);
};

export const updateIntegration = async (id: string, data: UpdateIntegrationDto): Promise<Integration> => {
    return apiClient.patch<Integration>(`/integrations/${id}`, data);
};

export const activateIntegration = async (id: string): Promise<Integration> => {
    return apiClient.post<Integration>(`/integrations/${id}/activate`);
};

export const deactivateIntegration = async (id: string): Promise<Integration> => {
    return apiClient.post<Integration>(`/integrations/${id}/deactivate`);
};

export const testConnection = async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(`/integrations/${id}/test`);
};

export const deleteIntegration = async (id: string): Promise<void> => {
    await apiClient.delete(`/integrations/${id}`);
};
