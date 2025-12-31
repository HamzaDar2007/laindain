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
import { CreateConstantDto } from '../store/constants/constantsTypes';
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
        type: '',
        key: '',
        value: '',
        description: '',
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
            type: '',
            key: '',
            value: '',
            description: '',
            isActive: true,
        });
        setEditingConstant(null);
    };

    const handleEdit = (constant: any) => {
        setEditingConstant(constant);
        setFormData({
            type: constant.type,
            key: constant.key,
            value: constant.value,
            description: constant.description || '',
            isActive: constant.isActive,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('constants.confirmDelete'))) {
            await dispatch(deleteConstantAsync(id));
        }
    };

    const columns = [
        { key: 'type', header: t('constants.type') },
        { key: 'key', header: t('constants.key') },
        { key: 'value', header: t('constants.value') },
        { key: 'description', header: t('constants.description') },
        {
            key: 'isActive',
            header: t('constants.status'),
            render: (constant: any) => (
                <span className={`px-2 py-1 rounded text-xs ${constant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {constant.isActive ? t('common.active') : t('common.inactive')}
                </span>
            )
        },
        {
            key: 'actions',
            header: t('common.actions'),
            render: (record: any) => (
                <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                        {t('common.edit')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(record.id)}>
                        {t('common.delete')}
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{t('constants.title')}</h1>
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
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('constants.type')}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                    />
                    <Input
                        label={t('constants.key')}
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        required
                    />
                    <Input
                        label={t('constants.value')}
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        required
                    />
                    <Input
                        label={t('constants.description')}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <Select
                        label={t('constants.status')}
                        value={formData.isActive ? 'true' : 'false'}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                        options={[
                            { value: 'true', label: t('common.active') },
                            { value: 'false', label: t('common.inactive') },
                        ]}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsModalOpen(false);
                                resetForm();
                            }}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">
                            {editingConstant ? t('common.update') : t('common.create')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Constants;