import { apiClient } from '../common/apiHelper';
import { InviteTenantUserDto, UpdateTenantUserRoleDto, TenantUser, UserRole } from './tenantUsersTypes';

// Shared mapping function to ensure consistent user structure
const mapTenantUser = (user: any): TenantUser => {
    // Robust name handling
    let firstName = user.firstName;
    let lastName = user.lastName;

    if (!firstName && user.fullName) {
        const parts = user.fullName.trim().split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
    }

    // Fallback if still empty (e.g. for simple invitations)
    if (!firstName && user.email) {
        firstName = user.email.split('@')[0];
    }

    return {
        ...user,
        role: (user.role || 'USER').toLowerCase() as UserRole,
        status: user.status || 'active',
        userId: user.id,
        firstName: firstName || '',
        lastName: lastName || '',
        joinedAt: user.joinedAt || user.createdAt,
    };
};

export const fetchTenantUsers = async (): Promise<TenantUser[]> => {
    const users = await apiClient.get<any[]>('/users');
    return users.map(mapTenantUser);
};

export const fetchTenantUser = async (id: string): Promise<TenantUser> => {
    return apiClient.get(`/users/${id}`);
};

export const inviteTenantUser = async (data: InviteTenantUserDto): Promise<TenantUser> => {
    const user = await apiClient.post('/users/invite', data);
    return mapTenantUser(user);
};

export const acceptInvitation = async (invitationId: string): Promise<any> => {
    return apiClient.post('/users/accept', { invitationId });
};

export const getMyTenants = async (): Promise<any[]> => {
    return apiClient.get('/users/my-tenants');
};

export const updateTenantUserRole = async (id: string, data: UpdateTenantUserRoleDto): Promise<TenantUser> => {
    return apiClient.patch(`/users/${id}`, data);
};

export const removeTenantUser = async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};
