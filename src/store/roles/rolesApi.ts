import { apiClient } from '../common/apiHelper';
import { CreateRoleDto, Role, UpdateRoleDto } from './rolesTypes';

export const fetchRoles = async (): Promise<Role[]> => {
    return await apiClient.get('/roles');
};

export const createRole = async (data: CreateRoleDto): Promise<Role> => {
    return await apiClient.post('/roles', data);
};

export const updateRole = async (id: string, data: UpdateRoleDto): Promise<Role> => {
    return await apiClient.patch(`/roles/${id}`, data);
};

export const deleteRole = async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
};
