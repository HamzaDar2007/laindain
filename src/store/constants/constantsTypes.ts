export interface Constant {
    id: string;
    type: string;
    key: string;
    value: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateConstantDto {
    type: string;
    key: string;
    value: string;
    description?: string;
    isActive?: boolean;
}

export interface ConstantsState {
    constants: Constant[];
    loading: boolean;
    error: string | null;
}