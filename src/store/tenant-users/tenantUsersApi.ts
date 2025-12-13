import { apiClient } from '../common/apiHelper';
import { InviteTenantUserDto, UpdateTenantUserRoleDto, TenantUser } from './tenantUsersTypes';

export const fetchTenantUsers = async (): Promise<TenantUser[]> => {
    return apiClient.get('/tenant-users');
};

export const fetchTenantUser = async (id: string): Promise<TenantUser> => {
    return apiClient.get(`/tenant-users/${id}`);
};

export const inviteTenantUser = async (data: InviteTenantUserDto): Promise<TenantUser> => {
    return apiClient.post('/tenant-users/invite', data);
};

export const acceptInvitation = async (invitationId: string): Promise<any> => {
    return apiClient.post('/tenant-users/accept', { invitationId });
};

export const getMyTenants = async (): Promise<any[]> => {
    return apiClient.get('/tenant-users/my-tenants');
};

export const updateTenantUserRole = async (id: string, data: UpdateTenantUserRoleDto): Promise<TenantUser> => {
    return apiClient.patch(`/tenant-users/${id}`, data);
};

export const removeTenantUser = async (id: string): Promise<void> => {
    await apiClient.delete(`/tenant-users/${id}`);
};
