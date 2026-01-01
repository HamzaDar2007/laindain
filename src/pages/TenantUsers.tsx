import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllTenantUsers,
    selectTenantUsersLoading,
    selectTenantUsersError,
} from '../store/tenant-users/tenantUsersSelector';
import {
    fetchTenantUsersAsync,
    inviteTenantUserAsync,
    updateTenantUserRoleAsync,
    removeTenantUserAsync,
} from '../store/tenant-users/tenantUsersSlice';
import { InviteTenantUserDto, UserRole } from '../store/tenant-users/tenantUsersTypes';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const TenantUsers: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const tenantUsers = useSelector(selectAllTenantUsers);
    const isLoading = useSelector(selectTenantUsersLoading);
    const error = useSelector(selectTenantUsersError);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [inviteData, setInviteData] = useState<InviteTenantUserDto>({
        email: '',
        role: UserRole.USER,
    });

    useEffect(() => {
        dispatch(fetchTenantUsersAsync() as any);
    }, [dispatch]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(inviteTenantUserAsync(inviteData) as any);
        setShowInviteModal(false);
        setInviteData({ email: '', role: UserRole.USER });
    };

    const handleUpdateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            await dispatch(updateTenantUserRoleAsync({
                id: selectedUser.id,
                data: { role: selectedUser.role },
            }) as any);
            setShowRoleModal(false);
            setSelectedUser(null);
        }
    };

    const handleRemove = async (id: string) => {
        if (window.confirm(t('messages.deleteConfirm'))) {
            await dispatch(removeTenantUserAsync(id) as any);
        }
    };

    const openRoleModal = (user: any) => {
        setSelectedUser({ ...user });
        setShowRoleModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('users.title')}</h1>
                <Button onClick={() => setShowInviteModal(true)}>
                    {t('users.invite')}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : tenantUsers?.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    No team members found. Try inviting someone!
                </div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('users.name')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('users.email')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('users.role')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.status')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('users.joinedAt')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenantUsers?.map((user) => {
                                const roleName = user.role ? String(user.role).toLowerCase() : '';
                                return (
                                    <tr key={user.id}>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="badge badge-info">
                                                {roleName ? t(`users.roles.${roleName}`) : 'Unknown'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.status === 'active' ? 'badge-success' :
                                                user.status === 'invited' ? 'badge-warning' : 'badge-danger'
                                                }`}>
                                                {user.status ? t(`users.statuses.${user.status}`) : 'Unknown'}
                                            </span>
                                        </td>
                                        <td>{user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '-'}</td>
                                        <td className="space-x-2">
                                            <button
                                                onClick={() => openRoleModal(user)}
                                                className="text-primary-600 hover:text-primary-700 text-sm"
                                            >
                                                {t('users.changeRole')}
                                            </button>
                                            <button
                                                onClick={() => handleRemove(user.id)}
                                                className="text-danger-600 hover:text-danger-700 text-sm"
                                            >
                                                {t('users.remove')}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Invite Modal */}
            <Modal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                title={t('users.invite')}
            >
                <form onSubmit={handleInvite} className="space-y-4">
                    <Input
                        label={t('users.email')}
                        type="email"
                        value={inviteData.email}
                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                        required
                    />

                    <Select
                        label={t('users.role')}
                        value={inviteData.role}
                        onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as UserRole })}
                        required
                    >
                        <option value={UserRole.VIEWER}>{t('users.roles.viewer')}</option>
                        <option value={UserRole.USER}>{t('users.roles.user')}</option>
                        <option value={UserRole.ACCOUNTANT}>{t('users.roles.accountant')}</option>
                        <option value={UserRole.MANAGER}>{t('users.roles.manager')}</option>
                        <option value={UserRole.ADMIN}>{t('users.roles.admin')}</option>
                    </Select>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={() => setShowInviteModal(false)} type="button">
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">
                            {t('users.sendInvitation')}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Change Role Modal */}
            <Modal
                isOpen={showRoleModal}
                onClose={() => setShowRoleModal(false)}
                title={t('users.changeRole')}
            >
                {selectedUser && (
                    <form onSubmit={handleUpdateRole} className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {t('users.changingRoleFor')}: <strong>{selectedUser.email}</strong>
                            </p>
                        </div>

                        <Select
                            label={t('users.newRole')}
                            value={selectedUser.role}
                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as UserRole })}
                            required
                        >
                            <option value={UserRole.VIEWER}>{t('users.roles.viewer')}</option>
                            <option value={UserRole.USER}>{t('users.roles.user')}</option>
                            <option value={UserRole.ACCOUNTANT}>{t('users.roles.accountant')}</option>
                            <option value={UserRole.MANAGER}>{t('users.roles.manager')}</option>
                            <option value={UserRole.ADMIN}>{t('users.roles.admin')}</option>
                        </Select>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="secondary" onClick={() => setShowRoleModal(false)} type="button">
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit">
                                {t('common.save')}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default TenantUsers;
