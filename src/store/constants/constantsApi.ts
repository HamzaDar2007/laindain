import { apiClient } from '../common/apiHelper';
import { Constant, CreateConstantDto } from './constantsTypes';

export const constantsApi = {
    async fetchConstants(type?: string): Promise<Constant[]> {
        const params = type ? { type } : {};
        return apiClient.get<Constant[]>('/constants', { params });
    },

    async getConstant(id: string): Promise<Constant> {
        return apiClient.get<Constant>(`/constants/${id}`);
    },

    async createConstant(data: CreateConstantDto): Promise<Constant> {
        return apiClient.post<Constant>('/constants', data);
    },

    async updateConstant(id: string, data: Partial<CreateConstantDto>): Promise<Constant> {
        return apiClient.patch<Constant>(`/constants/${id}`, data);
    },

    async deleteConstant(id: string): Promise<void> {
        return apiClient.delete<void>(`/constants/${id}`);
    },
};