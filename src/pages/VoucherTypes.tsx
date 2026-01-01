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
import { CreateVoucherTypeDto, VoucherNature, VoucherType } from '../store/voucher-types/voucherTypesTypes';
import Select from '../components/common/Select';
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
        nature: VoucherNature.JOURNAL,
        autoNumbering: true,
        prefix: '',
        requiresApproval: false,
    });

    useEffect(() => {
        dispatch(fetchVoucherTypesAsync() as any);
    }, [dispatch]);

    const handleCreate = () => {
        setEditingVoucherType(null);
        setFormData({
            name: '',
            code: '',
            nature: VoucherNature.JOURNAL,
            autoNumbering: true,
            prefix: '',
            requiresApproval: false
        });
        setShowModal(true);
    };

    const handleEdit = (voucherType: VoucherType) => {
        setEditingVoucherType(voucherType);
        setFormData({
            name: voucherType.name,
            code: voucherType.code,
            nature: voucherType.nature,
            autoNumbering: voucherType.autoNumbering,
            prefix: voucherType.prefix || '',
            requiresApproval: voucherType.requiresApproval,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.code.trim() || !formData.name.trim()) {
            return; // Prevent submission if fields are empty
        }

        if (editingVoucherType) {
            await dispatch(updateVoucherTypeAsync({ id: editingVoucherType.id, data: formData }) as any);
        } else {
            await dispatch(createVoucherTypeAsync(formData) as any);
        }

        setShowModal(false);
        setFormData({
            name: '',
            code: '',
            nature: VoucherNature.JOURNAL,
            autoNumbering: true,
            prefix: '',
            requiresApproval: false
        });
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('voucherTypes.title')}</h1>
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
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('voucherTypes.code')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('voucherTypes.name')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('voucherTypes.nature')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.status')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voucherTypes.map((voucherType) => (
                                <tr key={voucherType.id}>
                                    <td className="font-mono">{voucherType.code}</td>
                                    <td>{voucherType.name}</td>
                                    <td>
                                        <span className="badge badge-info">{voucherType.nature}</span>
                                    </td>
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
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label={t('voucherTypes.nature')}
                            value={formData.nature}
                            onChange={(e) => setFormData({ ...formData, nature: e.target.value as VoucherNature })}
                            required
                        >
                            {Object.values(VoucherNature).map(val => (
                                <option key={val} value={val}>{val}</option>
                            ))}
                        </Select>
                        <Input
                            label={t('voucherTypes.prefix')}
                            value={formData.prefix}
                            onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                checked={formData.autoNumbering}
                                onChange={(e) => setFormData({ ...formData, autoNumbering: e.target.checked })}
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{t('voucherTypes.autoNumbering')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                checked={formData.requiresApproval}
                                onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{t('voucherTypes.requiresApproval')}</span>
                        </label>
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
