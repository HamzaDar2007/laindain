import { apiClient } from '../common/apiHelper';
import { Subscription, BillingTransaction, UpdateSubscriptionDto } from './billingTypes';

export const fetchSubscription = async (): Promise<Subscription> => {
    return apiClient.get<Subscription>('/billing/subscription');
};

export const updateSubscription = async (data: UpdateSubscriptionDto): Promise<Subscription> => {
    return apiClient.patch<Subscription>('/billing/subscription', data);
};

export const cancelSubscription = async (): Promise<Subscription> => {
    return apiClient.post<Subscription>('/billing/subscription/cancel');
};

export const fetchTransactions = async (): Promise<BillingTransaction[]> => {
    return apiClient.get<BillingTransaction[]>('/billing/transactions');
};
