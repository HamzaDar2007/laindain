import { createSlice } from '@reduxjs/toolkit';
import { AccountsState, CreateAccountDto } from './accountsTypes';
import { createAppAsyncThunk } from '../common/storeUtils';
import { accountsApi } from './accountsApi';

const initialState: AccountsState = {
    accounts: [],
    accountTree: [],
    postingAccounts: [],
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchAccountsAsync = createAppAsyncThunk(
    'accounts/fetchAll',
    async () => {
        return await accountsApi.fetchAccounts();
    }
);

export const fetchAccountTreeAsync = createAppAsyncThunk(
    'accounts/fetchTree',
    async () => {
        return await accountsApi.fetchAccountTree();
    }
);

export const fetchPostingAccountsAsync = createAppAsyncThunk(
    'accounts/fetchPosting',
    async () => {
        return await accountsApi.fetchPostingAccounts();
    }
);

export const createAccountAsync = createAppAsyncThunk(
    'accounts/create',
    async (data: CreateAccountDto) => {
        return await accountsApi.createAccount(data);
    }
);

export const updateAccountAsync = createAppAsyncThunk(
    'accounts/update',
    async ({ id, data }: { id: string; data: Partial<CreateAccountDto> }) => {
        return await accountsApi.updateAccount(id, data);
    }
);

export const deleteAccountAsync = createAppAsyncThunk(
    'accounts/delete',
    async (id: string) => {
        await accountsApi.deleteAccount(id);
        return id;
    }
);

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch accounts
        builder.addCase(fetchAccountsAsync.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchAccountsAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.accounts = action.payload;
        });
        builder.addCase(fetchAccountsAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch account tree
        builder.addCase(fetchAccountTreeAsync.fulfilled, (state, action) => {
            state.accountTree = action.payload;
        });

        // Fetch posting accounts
        builder.addCase(fetchPostingAccountsAsync.fulfilled, (state, action) => {
            state.postingAccounts = action.payload;
        });

        // Create account
        builder.addCase(createAccountAsync.fulfilled, (state, action) => {
            state.accounts.push(action.payload);
        });

        // Update account
        builder.addCase(updateAccountAsync.fulfilled, (state, action) => {
            const index = state.accounts.findIndex((a) => a.id === action.payload.id);
            if (index !== -1) {
                state.accounts[index] = action.payload;
            }
        });

        // Delete account
        builder.addCase(deleteAccountAsync.fulfilled, (state, action) => {
            state.accounts = state.accounts.filter((a) => a.id !== action.payload);
        });
    },
});

export default accountsSlice.reducer;
