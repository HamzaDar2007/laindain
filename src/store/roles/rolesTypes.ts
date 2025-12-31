export interface Role {
    id: string;
    companyId: string | null;
    code: string;
    name: string;
    isSystem: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleDto {
    code: string;
    name: string;
    isSystem?: boolean;
}

export interface UpdateRoleDto {
    code?: string;
    name?: string;
    isSystem?: boolean;
}

export interface RolesState {
    roles: Role[];
    isLoading: boolean;
    error: string | null;
}
