import { RootState } from '../index';
import { Account } from './accountsTypes';

export const selectAllAccounts = (state: RootState) => state.accounts.accounts;
export const selectAccountTree = (state: RootState) => state.accounts.accountTree;
export const selectPostingAccounts = (state: RootState) => state.accounts.postingAccounts;
export const selectAccountsLoading = (state: RootState) => state.accounts.isLoading;
export const selectAccountsError = (state: RootState) => state.accounts.error;

// Get accounts by level
export const selectAccountsByLevel = (level: number) => (state: RootState) =>
    state.accounts.accounts.filter((account) => account.level === level);

// Get accounts by type
export const selectAccountsByType = (type: string) => (state: RootState) =>
    state.accounts.accounts.filter((account) => account.type === type);

// Get account by ID
export const selectAccountById = (id: string) => (state: RootState) =>
    state.accounts.accounts.find((account) => account.id === id);
