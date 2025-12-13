import { RootState } from '../index';

export const selectSubscription = (state: RootState) => state.billing.subscription;
export const selectTransactions = (state: RootState) => state.billing.transactions;
export const selectBillingLoading = (state: RootState) => state.billing.isLoading;
export const selectBillingError = (state: RootState) => state.billing.error;

export const selectIsSubscriptionActive = (state: RootState) =>
    state.billing.subscription?.status === 'active';

export const selectIsSubscriptionTrial = (state: RootState) =>
    state.billing.subscription?.status === 'trial';

export const selectTransactionsByStatus = (state: RootState, status: string) =>
    state.billing.transactions.filter(t => t.status === status);

export const selectCompletedTransactions = (state: RootState) =>
    state.billing.transactions.filter(t => t.status === 'completed');
