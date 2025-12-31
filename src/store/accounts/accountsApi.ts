import { apiClient } from '../common/apiHelper';
import { Account, CreateAccountDto } from './accountsTypes';

export const accountsApi = {
    async fetchAccounts(): Promise<Account[]> {
        return apiClient.get<Account[]>('/accounts');
    },

    async fetchAccountTree(): Promise<Account[]> {
        return apiClient.get<Account[]>('/accounts/chart');
    },

    async fetchPostingAccounts(): Promise<Account[]> {
        return apiClient.get<Account[]>('/accounts/posting');
    },

    async fetchAccountsByLevel(level: number): Promise<Account[]> {
        return apiClient.get<Account[]>(`/accounts/level/${level}`);
    },

    async getAccount(id: string): Promise<Account> {
        return apiClient.get<Account>(`/accounts/${id}`);
    },

    async createAccount(data: CreateAccountDto): Promise<Account> {
        return apiClient.post<Account>('/accounts', data);
    },

    async updateAccount(id: string, data: Partial<CreateAccountDto>): Promise<Account> {
        return apiClient.patch<Account>(`/accounts/${id}`, data);
    },

    async deleteAccount(id: string): Promise<void> {
        return apiClient.delete<void>(`/accounts/${id}`);
    },
};
