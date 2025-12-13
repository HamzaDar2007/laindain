import { apiClient } from '../common/apiHelper';
import { Account, CreateAccountDto } from './accountsTypes';

export const accountsApi = {
    async fetchAccounts(): Promise<Account[]> {
        return apiClient.get<Account[]>('/accounting/accounts');
    },

    async fetchAccountTree(): Promise<Account[]> {
        return apiClient.get<Account[]>('/accounting/accounts/tree');
    },

    async fetchPostingAccounts(): Promise<Account[]> {
        return apiClient.get<Account[]>('/accounting/accounts/posting');
    },

    async fetchAccountsByLevel(level: number): Promise<Account[]> {
        return apiClient.get<Account[]>(`/accounting/accounts/level/${level}`);
    },

    async getAccount(id: string): Promise<Account> {
        return apiClient.get<Account>(`/accounting/accounts/${id}`);
    },

    async createAccount(data: CreateAccountDto): Promise<Account> {
        return apiClient.post<Account>('/accounting/accounts', data);
    },

    async updateAccount(id: string, data: Partial<CreateAccountDto>): Promise<Account> {
        return apiClient.patch<Account>(`/accounting/accounts/${id}`, data);
    },

    async deleteAccount(id: string): Promise<void> {
        return apiClient.delete<void>(`/accounting/accounts/${id}`);
    },
};
