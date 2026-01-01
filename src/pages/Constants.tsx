import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch } from '../store';
import {
    fetchConstantsAsync,
    createConstantAsync,
    updateConstantAsync,
    deleteConstantAsync
} from '../store/constants/constantsSlice';
import {
    selectConstants,
    selectConstantsLoading,
    selectConstantsError
} from '../store/constants/constantsSelector';
import { CreateConstantDto, ConstantType } from '../store/constants/constantsTypes';
import { Button, Input, Select, Modal, Table, Card } from '../components/common';

const Constants: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const constants = useSelector(selectConstants);
    const loading = useSelector(selectConstantsLoading);
    const error = useSelector(selectConstantsError);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConstant, setEditingConstant] = useState<any>(null);
    const [formData, setFormData] = useState<CreateConstantDto>({
        code: '',
        name: '',
        type: ConstantType.CUSTOMER,
        email: '',
        phone: '',
        address: '',
        taxRegistrationNo: '',
        creditLimit: 0,
        paymentTerms: 30,
        isActive: true,
    });

    useEffect(() => {
        dispatch(fetchConstantsAsync());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingConstant) {
                await dispatch(updateConstantAsync({ id: editingConstant.id, data: formData }));
            } else {
                await dispatch(createConstantAsync(formData));
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving constant:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            type: ConstantType.CUSTOMER,
            email: '',
            phone: '',
            address: '',
            taxRegistrationNo: '',
            creditLimit: 0,
            paymentTerms: 30,
            isActive: true,
        });
        setEditingConstant(null);
    };

    const handleEdit = (constant: any) => {
        setEditingConstant(constant);
        setFormData({
            code: constant.code,
            name: constant.name,
            type: constant.type,
            email: constant.email || '',
            phone: constant.phone || '',
            address: constant.address || '',
            taxRegistrationNo: constant.taxRegistrationNo || '',
            creditLimit: constant.creditLimit || 0,
            paymentTerms: constant.paymentTerms || 30,
            isActive: constant.isActive,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('messages.deleteConfirm'))) {
            await dispatch(deleteConstantAsync(id));
        }
    };

    const columns = [
        { key: 'code', header: t('constants.code') },
        { key: 'name', header: t('constants.name') },
        {
            key: 'type',
            header: t('constants.type'),
            render: (record: any) => (
                <span className="capitalize">{record.type}</span>
            )
        },
        { key: 'email', header: t('constants.email') },
        { key: 'phone', header: t('constants.phone') },
        {
            key: 'isActive',
            header: t('common.status'),
            render: (constant: any) => (
                <span className={`badge ${constant.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {constant.isActive ? t('common.active') : t('common.inactive')}
                </span>
            )
        },
        {
            key: 'actions',
            header: t('common.actions'),
            render: (record: any) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(record)}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                        {t('common.edit')}
                    </button>
                    <button
                        onClick={() => handleDelete(record.id)}
                        className="text-danger-600 hover:text-danger-700 text-sm"
                    >
                        {t('common.delete')}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('constants.title')}</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    {t('constants.addConstant')}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <Card>
                <Table
                    data={constants}
                    columns={columns}
                    loading={loading}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    resetForm();
                }}
                title={editingConstant ? t('constants.editConstant') : t('constants.addConstant')}
                size="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('constants.code')}
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                        />
                        <Select
                            label={t('constants.type')}
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as ConstantType })}
                            options={[
                                { value: ConstantType.CUSTOMER, label: 'Customer' },
                                { value: ConstantType.SUPPLIER, label: 'Supplier' },
                                { value: ConstantType.BOTH, label: 'Both' },
                            ]}
                        />
                    </div>
                    <Input
                        label={t('constants.name')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('constants.email')}
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label={t('constants.phone')}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <Input
                        label={t('constants.address')}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label={t('constants.taxRegistrationNo')}
                            value={formData.taxRegistrationNo}
                            onChange={(e) => setFormData({ ...formData, taxRegistrationNo: e.target.value })}
                        />
                        <Input
                            label={t('constants.creditLimit')}
                            type="number"
                            value={formData.creditLimit}
                            onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) })}
                        />
                        <Input
                            label={t('constants.paymentTerms')}
                            type="number"
                            value={formData.paymentTerms}
                            onChange={(e) => setFormData({ ...formData, paymentTerms: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('common.active')}
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsModalOpen(false);
                                resetForm();
                            }}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">
                            {editingConstant ? t('common.save') : t('common.create')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Constants;