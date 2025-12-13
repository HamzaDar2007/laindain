import { RootState } from '../index';

export const selectAllPayments = (state: RootState) => state.payments.payments;
export const selectCurrentPayment = (state: RootState) => state.payments.currentPayment;
export const selectPaymentsLoading = (state: RootState) => state.payments.isLoading;
export const selectPaymentsError = (state: RootState) => state.payments.error;

export const selectPaymentById = (state: RootState, id: string) =>
    state.payments.payments.find(p => p.id === id);

export const selectPaymentsByStatus = (state: RootState, status: 'pending' | 'confirmed' | 'cancelled') =>
    state.payments.payments.filter(p => p.status === status);

export const selectPendingPayments = (state: RootState) =>
    state.payments.payments.filter(p => p.status === 'pending');

export const selectConfirmedPayments = (state: RootState) =>
    state.payments.payments.filter(p => p.status === 'confirmed');
