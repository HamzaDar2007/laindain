import { apiClient } from '../common/apiHelper';
import { CreateVoucherTypeDto, UpdateVoucherTypeDto, VoucherType } from './voucherTypesTypes';

export const fetchVoucherTypes = async (): Promise<VoucherType[]> => {
    return apiClient.get<VoucherType[]>('/accounting/voucher-types');
};

export const fetchVoucherType = async (id: string): Promise<VoucherType> => {
    return apiClient.get<VoucherType>(`/accounting/voucher-types/${id}`);
};

export const createVoucherType = async (data: CreateVoucherTypeDto): Promise<VoucherType> => {
    return apiClient.post<VoucherType>('/accounting/voucher-types', data);
};

export const updateVoucherType = async (id: string, data: UpdateVoucherTypeDto): Promise<VoucherType> => {
    return apiClient.patch<VoucherType>(`/accounting/voucher-types/${id}`, data);
};

export const deleteVoucherType = async (id: string): Promise<void> => {
    await apiClient.delete(`/accounting/voucher-types/${id}`);
};
