export interface VoucherType {
    id: string;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    tenantId: string;
}

export interface VoucherTypeState {
    voucherTypes: VoucherType[];
    currentVoucherType: VoucherType | null;
    isLoading: boolean;
    error: string | null;
}

export interface CreateVoucherTypeDto {
    name: string;
    code: string;
    description?: string;
}

export interface UpdateVoucherTypeDto {
    name?: string;
    code?: string;
    description?: string;
    isActive?: boolean;
}
