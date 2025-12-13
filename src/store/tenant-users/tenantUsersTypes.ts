export interface TenantUser {
    id: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: 'active' | 'invited' | 'inactive';
    invitedAt?: string;
    joinedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    TENANT_OWNER = 'TENANT_OWNER',
    ADMIN = 'ADMIN',
    ACCOUNTANT = 'ACCOUNTANT',
    MANAGER = 'MANAGER',
    USER = 'USER',
    VIEWER = 'VIEWER',
}

export interface TenantUserState {
    tenantUsers: TenantUser[];
    currentTenantUser: TenantUser | null;
    myTenants: any[];
    isLoading: boolean;
    error: string | null;
}

export interface InviteTenantUserDto {
    email: string;
    role: UserRole;
}

export interface UpdateTenantUserRoleDto {
    role: UserRole;
}

export interface AcceptInvitationDto {
    invitationId: string;
}
