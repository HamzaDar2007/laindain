import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllAccounts,
    selectAccountTree,
    selectAccountsLoading,
} from '../store/accounts/accountsSelector';
import {
    fetchAccountsAsync,
    fetchAccountTreeAsync,
    createAccountAsync,
    deleteAccountAsync,
} from '../store/accounts/accountsSlice';
import { Account, AccountType, CreateAccountDto } from '../store/accounts/accountsTypes';
import { generateAccountCode } from '../utils/codeGenerator';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useToast } from '../context/ToastContext';

const Accounts: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accounts = useSelector(selectAllAccounts);
    const accountTree = useSelector(selectAccountTree);
    const isLoading = useSelector(selectAccountsLoading);
    const toast = useToast();

    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
    const [formData, setFormData] = useState<CreateAccountDto>({
        name: '',
        type: AccountType.ASSET,
        level: 1,
        description: '',
    });

    useEffect(() => {
        dispatch(fetchAccountsAsync() as any);
        dispatch(fetchAccountTreeAsync() as any);
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Auto-generate code if not provided
            let finalCode = formData.code;
            if (!finalCode) {
                const parentAccount = formData.parentId
                    ? accounts.find((a) => a.id === formData.parentId)
                    : null;

                finalCode = generateAccountCode(
                    formData.level,
                    formData.type,
                    parentAccount?.code || null,
                    accounts
                );
            }

            const payload = {
                ...formData,
                code: finalCode,
                level: formData.level.toString(),
                isPosting: Number(formData.level) === 4, // Level 4 accounts must be posting accounts
            };

            await dispatch(createAccountAsync(payload as any) as any).unwrap();

            // Refresh both the flat list and tree view
            await dispatch(fetchAccountsAsync() as any);
            await dispatch(fetchAccountTreeAsync() as any);

            setShowModal(false);
            setFormData({
                name: '',
                type: AccountType.ASSET,
                level: 1,
                description: '',
            });
            toast.success(t('accounts.createSuccess') || 'Account created successfully');
        } catch (error: any) {
            toast.error(error.message || t('common.error'));
        }
    };

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (window.confirm(t('common.confirmDelete'))) {
            try {
                await dispatch(deleteAccountAsync(id) as any).unwrap();
                await dispatch(fetchAccountTreeAsync() as any);
                toast.success(t('accounts.deleteSuccess') || 'Account deleted successfully');
            } catch (error: any) {
                toast.error(error.message || t('common.error'));
            }
        }
    };

    const renderAccountTree = (accounts: Account[], level: number = 0) => {
        return accounts.map((account) => (
            <div key={account.id} className="animate-fade-in">
                <div
                    className={`
                        flex items-center justify-between p-3 my-1 rounded-lg transition-colors
                        ${level === 0 ? 'bg-gray-50 dark:bg-gray-800/50 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'}
                        border-b border-gray-100 dark:border-gray-700/50
                    `}
                    style={{ marginLeft: `${level * 24}px` }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-2 h-2 rounded-full
                            ${account.type === AccountType.ASSET ? 'bg-emerald-500' : ''}
                            ${account.type === AccountType.LIABILITY ? 'bg-red-500' : ''}
                            ${account.type === AccountType.EQUITY ? 'bg-blue-500' : ''}
                            ${account.type === AccountType.INCOME ? 'bg-purple-500' : ''}
                            ${account.type === AccountType.EXPENSE ? 'bg-orange-500' : ''}
                        `} />
                        <div>
                            <span className="text-gray-900 dark:text-white mr-2">{account.name}</span>
                            <span className="font-mono text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{account.code}</span>
                            {account.isPosting && (
                                <span className="ml-2 text-xs text-success-600 bg-success-50 dark:bg-success-900/20 px-1.5 py-0.5 rounded border border-success-100 dark:border-success-800">
                                    Posting
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{account.type}</span>
                        <button
                            onClick={(e) => handleDelete(account.id, e)}
                            className="text-gray-400 hover:text-danger-500 transition-colors p-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                {account.children && account.children.length > 0 && renderAccountTree(account.children, level + 1)}
            </div>
        ));
    };

    const columns = [
        {
            key: 'code',
            header: t('accounts.code'),
            render: (account: Account) => <span className="font-mono font-medium text-primary-600 dark:text-primary-400">{account.code}</span>,
            sortable: true,
        },
        {
            key: 'name',
            header: t('accounts.name'),
            sortable: true,
        },
        {
            key: 'type',
            header: t('accounts.type'),
            render: (account: Account) => (
                <span className={`
                    badge
                    ${account.type === AccountType.ASSET ? 'badge-success' : ''}
                    ${account.type === AccountType.LIABILITY ? 'badge-danger' : ''}
                    ${account.type === AccountType.EQUITY ? 'badge-info' : ''}
                    ${account.type === AccountType.INCOME ? 'badge-primary' : ''}
                    ${account.type === AccountType.EXPENSE ? 'badge-warning' : ''}
                `}>
                    {account.type}
                </span>
            ),
            sortable: true,
        },
        {
            key: 'level',
            header: t('accounts.level'),
            sortable: true,
        },
        {
            key: 'balance',
            header: t('accounts.balance'),
            render: (account: Account) => <span className="font-mono">{Number(account.currentBalance || 0).toFixed(2)}</span>,
            sortable: true,
        },
        {
            key: 'actions',
            header: t('common.actions'),
            render: (account: Account) => (
                <button
                    onClick={(e) => handleDelete(account.id, e)}
                    className="p-1 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            ),
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title={t('accounts.title')}
                description="Manage your chart of accounts."
                actions={
                    <div className="flex gap-3">
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {t('accounts.listView')}
                            </button>
                            <button
                                onClick={() => setViewMode('tree')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'tree'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {t('accounts.treeView')}
                            </button>
                        </div>
                        <Button onClick={() => setShowModal(true)} className="shadow-lg hover:shadow-primary-500/30">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {t('accounts.create')}
                        </Button>
                    </div>
                }
            />

            {viewMode === 'list' ? (
                <Table
                    data={accounts}
                    columns={columns}
                    loading={isLoading}
                    emptyMessage="No accounts found."
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-full h-10 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        renderAccountTree(accountTree)
                    )}
                </div>
            )}

            {/* Create Account Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={t('accounts.create')}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label={t('accounts.name')}
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('accounts.level')}
                        </label>
                        <Select
                            value={formData.level}
                            onChange={(e) => {
                                const newLevel = parseInt(e.target.value);
                                setFormData({
                                    ...formData,
                                    level: newLevel,
                                    parentId: undefined
                                });
                            }}
                            options={[
                                { value: 1, label: t('accounts.levels.1') },
                                { value: 2, label: t('accounts.levels.2') },
                                { value: 3, label: t('accounts.levels.3') },
                                { value: 4, label: t('accounts.levels.4') },
                            ]}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.level === 1
                                ? 'Level 1 accounts define the account type (Asset, Liability, etc.)'
                                : 'Type will be inherited from parent account'}
                        </p>
                    </div>

                    {formData.level === 1 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('accounts.type')}
                            </label>
                            <Select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
                                options={[
                                    { value: AccountType.ASSET, label: t('accounts.types.asset') },
                                    { value: AccountType.LIABILITY, label: t('accounts.types.liability') },
                                    { value: AccountType.EQUITY, label: t('accounts.types.equity') },
                                    { value: AccountType.INCOME, label: t('accounts.types.income') },
                                    { value: AccountType.EXPENSE, label: t('accounts.types.expense') },
                                ]}
                            />
                        </div>
                    )}

                    {Number(formData.level) > 1 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('accounts.parent')} <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={formData.parentId || ''}
                                required
                                onChange={(e) => {
                                    const parentAccount = accounts.find(a => a.id === e.target.value);
                                    setFormData({
                                        ...formData,
                                        parentId: e.target.value,
                                        type: parentAccount?.type || formData.type // Inherit type from parent
                                    });
                                }}
                                options={[
                                    { value: '', label: t('common.select') },
                                    ...accounts
                                        .filter((a) => Number(a.level) === Number(formData.level) - 1)
                                        .map((a) => ({ value: a.id, label: `${a.code} - ${a.name} (${a.type})` }))
                                ]}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('accounts.description')}
                        </label>
                        <textarea
                            className="input w-full"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {Number(formData.level) > 1 && formData.parentId && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Account Preview:</p>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                Type: <strong>{accounts.find(a => a.id === formData.parentId)?.type}</strong> (inherited from parent)
                            </p>
                            {formData.level === 4 && (
                                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                                    ✓ This will be a <strong>Posting Account</strong> (can record transactions)
                                </p>
                            )}
                        </div>
                    )}

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

export default Accounts;
