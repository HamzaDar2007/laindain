import { apiClient } from '../common/apiHelper';
import { InviteTenantUserDto, UpdateTenantUserRoleDto, TenantUser } from './tenantUsersTypes';

export const fetchTenantUsers = async (): Promise<TenantUser[]> => {
    const users = await apiClient.get<any[]>('/users');
    return users.map(user => {
        let firstName = user.firstName;
        let lastName = user.lastName;

        if (!firstName && user.fullName) {
            const parts = user.fullName.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ');
        }

        return {
            ...user,
            role: user.roles && user.roles.length > 0 ? user.roles[0] : 'USER',
            status: user.status || 'active',
            userId: user.id,
            firstName: firstName || '',
            lastName: lastName || '',
        };
    });
};

export const fetchTenantUser = async (id: string): Promise<TenantUser> => {
    return apiClient.get(`/users/${id}`);
};

export const inviteTenantUser = async (data: InviteTenantUserDto): Promise<TenantUser> => {
    return apiClient.post('/users/invite', data);
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
