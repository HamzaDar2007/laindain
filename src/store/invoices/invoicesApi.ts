import { apiClient } from '../common/apiHelper';
import { CreateInvoiceDto, UpdateInvoiceDto, Invoice } from './invoicesTypes';

export const fetchInvoices = async (): Promise<Invoice[]> => {
    return apiClient.get<Invoice[]>('/accounting/invoices');
};

export const fetchInvoice = async (id: string): Promise<Invoice> => {
    return apiClient.get<Invoice>(`/accounting/invoices/${id}`);
};

export const createInvoice = async (data: CreateInvoiceDto): Promise<Invoice> => {
    return apiClient.post<Invoice>('/accounting/invoices', data);
};

export const updateInvoice = async (id: string, data: UpdateInvoiceDto): Promise<Invoice> => {
    return apiClient.patch<Invoice>(`/accounting/invoices/${id}`, data);
};

export const postInvoice = async (id: string): Promise<Invoice> => {
    return apiClient.post<Invoice>(`/accounting/invoices/${id}/post`);
};

export const cancelInvoice = async (id: string): Promise<Invoice> => {
    return apiClient.post<Invoice>(`/accounting/invoices/${id}/cancel`);
};

export const deleteInvoice = async (id: string): Promise<void> => {
    await apiClient.delete(`/accounting/invoices/${id}`);
};
