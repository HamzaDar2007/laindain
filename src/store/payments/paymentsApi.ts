import { apiClient } from '../common/apiHelper';
import { CreatePaymentDto, UpdatePaymentDto, Payment } from './paymentsTypes';

export const fetchPayments = async (): Promise<Payment[]> => {
    return apiClient.get<Payment[]>('/payments');
};

export const fetchPayment = async (id: string): Promise<Payment> => {
    return apiClient.get<Payment>(`/payments/${id}`);
};

export const createPayment = async (data: CreatePaymentDto): Promise<Payment> => {
    return apiClient.post<Payment>('/payments', data);
};

export const updatePayment = async (id: string, data: UpdatePaymentDto): Promise<Payment> => {
    return apiClient.post<Payment>(`/payments/${id}`, data);
};

export const confirmPayment = async (id: string): Promise<Payment> => {
    return apiClient.post<Payment>(`/payments/${id}/confirm`);
};

export const cancelPayment = async (id: string): Promise<Payment> => {
    return apiClient.post<Payment>(`/payments/${id}/cancel`);
};

export const deletePayment = async (id: string): Promise<void> => {
    await apiClient.delete(`/payments/${id}`);
};
