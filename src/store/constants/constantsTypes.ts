export enum ConstantType {
    CUSTOMER = 'customer',
    SUPPLIER = 'supplier',
    BOTH = 'both',
}

export interface Constant {
    id: string;
    code: string;
    name: string;
    type: ConstantType;
    email?: string;
    phone?: string;
    address?: string;
    taxRegistrationNo?: string;
    creditLimit: number;
    paymentTerms: number;
    accountId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateConstantDto {
    code: string;
    name: string;
    type: ConstantType;
    email?: string;
    phone?: string;
    address?: string;
    taxRegistrationNo?: string;
    creditLimit?: number;
    paymentTerms?: number;
    accountId?: string;
    isActive?: boolean;
}

export interface ConstantsState {
    constants: Constant[];
    loading: boolean;
    error: string | null;
}