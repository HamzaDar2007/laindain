export enum AccountType {
    ASSET = 'asset',
    LIABILITY = 'liability',
    EQUITY = 'equity',
    INCOME = 'income',
    EXPENSE = 'expense',
}


export interface Account {
    id: string;
    companyId: string;
    tenantId?: string; // fallback
    code: string;
    name: string;
    description?: string;
    type: AccountType;
    level: string | number;
    parentId?: string;
    parent?: Account;
    children?: Account[];
    isPosting: boolean;
    isActive: boolean;
    currentBalance: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAccountDto {
    name: string;
    code?: string;
    description?: string;
    type: AccountType;
    level: string | number;
    parentId?: string;
    isPosting?: boolean;
}

export interface AccountsState {
    accounts: Account[];
    accountTree: Account[];
    postingAccounts: Account[];
    isLoading: boolean;
    error: string | null;
}
