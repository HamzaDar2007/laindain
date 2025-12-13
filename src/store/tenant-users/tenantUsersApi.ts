import { apiClient } from '../common/apiHelper';
import { InviteTenantUserDto, UpdateTenantUserRoleDto, TenantUser } from './tenantUsersTypes';

export const fetchTenantUsers = async (): Promise<TenantUser[]> => {
    const response = await apiClient.get('/tenant-users');
    return response.data;
};

export const fetchTenantUser = async (id: string): Promise<TenantUser> => {
    const response = await apiClient.get(`/tenant-users/${id}`);
    return response.data;
};

export const inviteTenantUser = async (data: InviteTenantUserDto): Promise<TenantUser> => {
    const response = await apiClient.post('/tenant-users/invite', data);
    return response.data;
};

export const acceptInvitation = async (invitationId: string): Promise<any> => {
    const response = await apiClient.post('/tenant-users/accept', { invitationId });
    return response.data;
};

export const getMyTenants = async (): Promise<any[]> => {
    const response = await apiClient.get('/tenant-users/my-tenants');
    return response.data;
};

export const updateTenantUserRole = async (id: string, data: UpdateTenantUserRoleDto): Promise<TenantUser> => {
    const response = await apiClient.patch(`/tenant-users/${id}`, data);
    return response.data;
};

export const removeTenantUser = async (id: string): Promise<void> => {
    await apiClient.delete(`/tenant-users/${id}`);
};
