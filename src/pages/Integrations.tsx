import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllIntegrations,
    selectIntegrationsLoading,
} from '../store/integrations/integrationsSelector';
import {
    fetchIntegrationsAsync,
    createIntegrationAsync,
    updateIntegrationAsync,
    activateIntegrationAsync,
    deactivateIntegrationAsync,
    testConnectionAsync,
    deleteIntegrationAsync,
} from '../store/integrations/integrationsSlice';
import { CreateIntegrationDto, IntegrationType, Integration } from '../store/integrations/integrationsTypes';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';

const Integrations: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const integrations = useSelector(selectAllIntegrations);
    const isLoading = useSelector(selectIntegrationsLoading);

    const [showModal, setShowModal] = useState(false);
    const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
    const [formData, setFormData] = useState<CreateIntegrationDto>({
        type: IntegrationType.API,
        name: '',
        description: '',
        apiKey: '',
        webhookUrl: '',
    });

    useEffect(() => {
        dispatch(fetchIntegrationsAsync() as any);
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingIntegration) {
            await dispatch(updateIntegrationAsync({ id: editingIntegration.id, data: formData }) as any);
        } else {
            await dispatch(createIntegrationAsync(formData) as any);
        }
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            type: IntegrationType.API,
            name: '',
            description: '',
            apiKey: '',
            webhookUrl: '',
        });
        setEditingIntegration(null);
    };

    const handleEdit = (integration: Integration) => {
        setEditingIntegration(integration);
        setFormData({
            type: integration.type,
            name: integration.name,
            description: integration.description || '',
            apiKey: integration.apiKey || '',
            webhookUrl: integration.webhookUrl || '',
        });
        setShowModal(true);
    };

    const handleActivate = async (id: string) => {
        await dispatch(activateIntegrationAsync(id) as any);
    };

    const handleDeactivate = async (id: string) => {
        await dispatch(deactivateIntegrationAsync(id) as any);
    };

    const handleTest = async (id: string) => {
        const result = await dispatch(testConnectionAsync(id) as any);
        if (result.payload) {
            alert(result.payload.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this integration?')) {
            await dispatch(deleteIntegrationAsync(id) as any);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'active': return 'badge-success';
            case 'inactive': return 'badge-secondary';
            case 'error': return 'badge-danger';
            default: return 'badge-secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('integrations.title')}</h1>
                <Button onClick={() => { resetForm(); setShowModal(true); }}>
                    {t('integrations.add')}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {integrations.map((integration) => (
                        <Card key={integration.id}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{integration.name}</h3>
                                        <p className="text-sm text-gray-600 capitalize">{integration.type}</p>
                                    </div>
                                    <span className={`badge ${getStatusBadgeClass(integration.status)}`}>
                                        {integration.status}
                                    </span>
                                </div>

                                {integration.description && (
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{integration.description}</p>
                                )}

                                {integration.lastSyncAt && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Last sync: {new Date(integration.lastSyncAt).toLocaleString()}
                                    </p>
                                )}

                                {integration.lastError && (
                                    <p className="text-xs text-red-600">
                                        Error: {integration.lastError}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-2 pt-2 border-t">
                                    <button
                                        onClick={() => handleEdit(integration)}
                                        className="text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        Edit
                                    </button>
                                    {integration.status === 'inactive' ? (
                                        <button
                                            onClick={() => handleActivate(integration.id)}
                                            className="text-sm text-green-600 hover:text-green-700"
                                        >
                                            Activate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDeactivate(integration.id)}
                                            className="text-sm text-yellow-600 hover:text-yellow-700"
                                        >
                                            Deactivate
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleTest(integration.id)}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Test
                                    </button>
                                    <button
                                        onClick={() => handleDelete(integration.id)}
                                        className="text-sm text-danger-600 hover:text-danger-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {integrations.length === 0 && !isLoading && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    No integrations configured yet. Click "Add Integration" to get started.
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); resetForm(); }}
                title={editingIntegration ? 'Edit Integration' : 'Add Integration'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        label="Type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as IntegrationType })}
                        required
                        disabled={!!editingIntegration}
                    >
                        <option value={IntegrationType.API}>API</option>
                        <option value={IntegrationType.WEBHOOK}>Webhook</option>
                        <option value={IntegrationType.STRIPE}>Stripe</option>
                        <option value={IntegrationType.PAYPAL}>PayPal</option>
                        <option value={IntegrationType.QUICKBOOKS}>QuickBooks</option>
                        <option value={IntegrationType.XERO}>Xero</option>
                        <option value={IntegrationType.ZAPIER}>Zapier</option>
                        <option value={IntegrationType.SLACK}>Slack</option>
                        <option value={IntegrationType.EMAIL}>Email</option>
                    </Select>

                    <Input
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            className="input"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <Input
                        label="API Key"
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        type="password"
                    />

                    <Input
                        label="Webhook URL"
                        value={formData.webhookUrl}
                        onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                        type="url"
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }} type="button">
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingIntegration ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Integrations;
