import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllVoucherTypes,
    selectVoucherTypesLoading,
} from '../store/voucher-types/voucherTypesSelector';
import {
    fetchVoucherTypesAsync,
    createVoucherTypeAsync,
    updateVoucherTypeAsync,
    deleteVoucherTypeAsync,
} from '../store/voucher-types/voucherTypesSlice';
import { CreateVoucherTypeDto, VoucherType } from '../store/voucher-types/voucherTypesTypes';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const VoucherTypes: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const voucherTypes = useSelector(selectAllVoucherTypes);
    const isLoading = useSelector(selectVoucherTypesLoading);

    const [showModal, setShowModal] = useState(false);
    const [editingVoucherType, setEditingVoucherType] = useState<VoucherType | null>(null);
    const [formData, setFormData] = useState<CreateVoucherTypeDto>({
        name: '',
        code: '',
        description: '',
    });

    useEffect(() => {
        dispatch(fetchVoucherTypesAsync() as any);
    }, [dispatch]);

    const handleCreate = () => {
        setEditingVoucherType(null);
        setFormData({ name: '', code: '', description: '' });
        setShowModal(true);
    };

    const handleEdit = (voucherType: VoucherType) => {
        setEditingVoucherType(voucherType);
        setFormData({
            name: voucherType.name,
            code: voucherType.code,
            description: voucherType.description || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingVoucherType) {
            await dispatch(updateVoucherTypeAsync({ id: editingVoucherType.id, data: formData }) as any);
        } else {
            await dispatch(createVoucherTypeAsync(formData) as any);
        }

        setShowModal(false);
        setFormData({ name: '', code: '', description: '' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('messages.deleteConfirm'))) {
            await dispatch(deleteVoucherTypeAsync(id) as any);
            await dispatch(fetchVoucherTypesAsync() as any);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{t('voucherTypes.title')}</h1>
                <Button onClick={handleCreate}>
                    {t('voucherTypes.create')}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{t('voucherTypes.code')}</th>
                                <th>{t('voucherTypes.name')}</th>
                                <th>{t('voucherTypes.description')}</th>
                                <th>{t('common.status')}</th>
                                <th>{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voucherTypes.map((voucherType) => (
                                <tr key={voucherType.id}>
                                    <td className="font-mono">{voucherType.code}</td>
                                    <td>{voucherType.name}</td>
                                    <td>{voucherType.description || '-'}</td>
                                    <td>
                                        <span className={`badge ${voucherType.isActive ? 'badge-success' : 'badge-danger'}`}>
                                            {voucherType.isActive ? t('common.active') : t('common.inactive')}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        <button
                                            onClick={() => handleEdit(voucherType)}
                                            className="text-primary-600 hover:text-primary-700 text-sm"
                                        >
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(voucherType.id)}
                                            className="text-danger-600 hover:text-danger-700 text-sm"
                                        >
                                            {t('common.delete')}
                                        </button>
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
                title={editingVoucherType ? t('voucherTypes.edit') : t('voucherTypes.create')}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('voucherTypes.code')}
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />
                    <Input
                        label={t('voucherTypes.name')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('voucherTypes.description')}
                        </label>
                        <textarea
                            className="input"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
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

export default VoucherTypes;
