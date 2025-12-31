import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchRolesAsync, createRoleAsync } from '../store/roles/rolesSlice';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Roles: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { roles, isLoading } = useSelector((state: RootState) => state.roles);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
    });

    useEffect(() => {
        dispatch(fetchRolesAsync() as any);
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(createRoleAsync(formData) as any);
        setShowModal(false);
        setFormData({ code: '', name: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{t('roles.title')}</h1>
                <Button onClick={() => setShowModal(true)}>
                    {t('roles.create')}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{t('roles.code')}</th>
                                <th>{t('roles.name')}</th>
                                <th>{t('roles.type')}</th>
                                <th>{t('common.createdAt')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id}>
                                    <td className="font-mono">{role.code}</td>
                                    <td className="font-medium">{role.name}</td>
                                    <td>
                                        <span className={`badge ${role.isSystem ? 'badge-info' : 'badge-warning'}`}>
                                            {role.isSystem ? 'System' : 'Custom'}
                                        </span>
                                    </td>
                                    <td className="text-sm text-gray-500">
                                        {new Date(role.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={t('roles.create')}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('roles.code')}
                        placeholder="e.g. manager"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />
                    <Input
                        label={t('roles.name')}
                        placeholder="e.g. Branch Manager"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">
                            {t('common.save')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Roles;
