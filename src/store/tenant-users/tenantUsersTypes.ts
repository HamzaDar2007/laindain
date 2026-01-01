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
    SUPER_ADMIN = 'super_admin',
    OWNER = 'owner',
    ADMIN = 'admin',
    ACCOUNTANT = 'accountant',
    MANAGER = 'manager',
    USER = 'user',
    STAFF = 'staff',
    VIEWER = 'viewer',
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
