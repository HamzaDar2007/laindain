export enum VoucherNature {
    PAYMENT = 'payment',
    RECEIPT = 'receipt',
    JOURNAL = 'journal',
    CONTRA = 'contra',
    SALES = 'sales',
    PURCHASE = 'purchase',
    CREDIT_NOTE = 'credit_note',
    DEBIT_NOTE = 'debit_note',
    OPENING = 'opening',
}

export interface VoucherType {
    id: string;
    name: string;
    code: string;
    nature: VoucherNature;
    autoNumbering: boolean;
    prefix?: string;
    requiresApproval: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    companyId: string;
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
    nature: VoucherNature;
    autoNumbering?: boolean;
    prefix?: string;
    requiresApproval?: boolean;
}

export interface UpdateVoucherTypeDto {
    name?: string;
    code?: string;
    nature?: VoucherNature;
    autoNumbering?: boolean;
    prefix?: string;
    requiresApproval?: boolean;
    isActive?: boolean;
}
