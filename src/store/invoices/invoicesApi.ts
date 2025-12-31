import { apiClient } from '../common/apiHelper';
import { CreateInvoiceDto, UpdateInvoiceDto, Invoice } from './invoicesTypes';

export const fetchInvoices = async (): Promise<Invoice[]> => {
    return apiClient.get<Invoice[]>('/invoices');
};

export const fetchInvoice = async (id: string): Promise<Invoice> => {
    return apiClient.get<Invoice>(`/invoices/${id}`);
};

export const createInvoice = async (data: CreateInvoiceDto): Promise<Invoice> => {
    return apiClient.post<Invoice>('/invoices', data);
};

export const updateInvoice = async (id: string, data: UpdateInvoiceDto): Promise<Invoice> => {
    return apiClient.patch<Invoice>(`/invoices/${id}`, data);
};

export const postInvoice = async (id: string): Promise<Invoice> => {
    return apiClient.post<Invoice>(`/invoices/${id}/post`);
};

export const cancelInvoice = async (id: string): Promise<Invoice> => {
    return apiClient.post<Invoice>(`/invoices/${id}/cancel`);
};

export const deleteInvoice = async (id: string): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`);
};
