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

const Accounts: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accounts = useSelector(selectAllAccounts);
    const accountTree = useSelector(selectAccountTree);
    const isLoading = useSelector(selectAccountsLoading);

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

        // Auto-generate code if not provided
        if (!formData.code) {
            const parentAccount = formData.parentId
                ? accounts.find((a) => a.id === formData.parentId)
                : null;

            const code = generateAccountCode(
                formData.level,
                formData.type,
                parentAccount?.code || null,
                accounts
            );

            formData.code = code;
        }

        // Set isPosting for level 4 accounts
        if (formData.level === 4) {
            formData.isPosting = true;
        }

        await dispatch(createAccountAsync(formData) as any);
        await dispatch(fetchAccountTreeAsync() as any);
        setShowModal(false);
        setFormData({
            name: '',
            type: AccountType.ASSET,
            level: 1,
            description: '',
        });
    };

    const handleDelete = async (id: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(t('common.confirmDelete'))) {
            try {
                const result = await dispatch(deleteAccountAsync(id) as any);
                await dispatch(fetchAccountTreeAsync() as any);
                if (result.meta.requestStatus === 'rejected') {
                    // Should extract error message from payload if possible
                    alert(t('common.deleteError') + ': ' + (result.payload || t('common.error')));
                }
            } catch (error) {
                console.error(error);
                alert(t('common.error'));
            }
        }
    };

    const renderAccountTree = (accounts: Account[], level: number = 0) => {
        return accounts.map((account) => (
            <div key={account.id} style={{ marginLeft: `${level * 20}px` }} className="border-l-2 border-gray-200 pl-4 py-2">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-medium text-gray-900">{account.name}</span>
                        <span className="ml-2 text-sm text-gray-500">({account.code})</span>
                        {account.isPosting && (
                            <span className="ml-2 badge badge-success text-xs">Posting</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`badge badge-info`}>{account.type}</span>
                        <button
                            onClick={() => handleDelete(account.id)}
                            className="text-danger-600 hover:text-danger-700 text-sm"
                        >
                            {t('common.delete')}
                        </button>
                    </div>
                </div>
                {account.children && account.children.length > 0 && renderAccountTree(account.children, level + 1)}
            </div>
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{t('accounts.title')}</h1>
                <div className="flex space-x-3">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            {t('accounts.listView')}
                        </button>
                        <button
                            onClick={() => setViewMode('tree')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'tree' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            {t('accounts.treeView')}
                        </button>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        {t('accounts.create')}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : viewMode === 'list' ? (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{t('accounts.code')}</th>
                                <th>{t('accounts.name')}</th>
                                <th>{t('accounts.type')}</th>
                                <th>{t('accounts.level')}</th>
                                <th>{t('accounts.balance')}</th>
                                <th>{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => (
                                <tr key={account.id}>
                                    <td className="font-mono">{account.code}</td>
                                    <td className="font-medium">{account.name}</td>
                                    <td>
                                        <span className="badge badge-info">{account.type}</span>
                                    </td>
                                    <td>{account.level}</td>
                                    <td className="font-mono">{Number(account.currentBalance || 0).toFixed(2)}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(account.id)}
                                            className="text-danger-600 hover:text-danger-700"
                                        >
                                            {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card">
                    {renderAccountTree(accountTree)}
                </div>
            )}

            {/* Create Account Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{t('accounts.create')}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('accounts.name')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Level Selection - Show for all, but explain differently */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('accounts.level')}
                                </label>
                                <select
                                    className="input"
                                    value={formData.level}
                                    onChange={(e) => {
                                        const newLevel = parseInt(e.target.value);
                                        setFormData({
                                            ...formData,
                                            level: newLevel,
                                            parentId: undefined // Reset parent when level changes
                                        });
                                    }}
                                >
                                    <option value={1}>{t('accounts.levels.1')}</option>
                                    <option value={2}>{t('accounts.levels.2')}</option>
                                    <option value={3}>{t('accounts.levels.3')}</option>
                                    <option value={4}>{t('accounts.levels.4')}</option>
                                </select>
                                {formData.level === 1 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Level 1 accounts define the account type (Asset, Liability, etc.)
                                    </p>
                                )}
                                {formData.level > 1 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Type will be inherited from parent account
                                    </p>
                                )}
                            </div>

                            {/* Account Type - Only show for Level 1 */}
                            {formData.level === 1 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('accounts.type')}
                                    </label>
                                    <select
                                        className="input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
                                    >
                                        <option value={AccountType.ASSET}>{t('accounts.types.asset')}</option>
                                        <option value={AccountType.LIABILITY}>{t('accounts.types.liability')}</option>
                                        <option value={AccountType.EQUITY}>{t('accounts.types.equity')}</option>
                                        <option value={AccountType.INCOME}>{t('accounts.types.income')}</option>
                                        <option value={AccountType.EXPENSE}>{t('accounts.types.expense')}</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        This determines the account classification
                                    </p>
                                </div>
                            )}

                            {/* Parent Account - Only show for Level 2, 3, 4 */}
                            {formData.level > 1 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('accounts.parent')} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="input"
                                        required
                                        value={formData.parentId || ''}
                                        onChange={(e) => {
                                            const parentAccount = accounts.find(a => a.id === e.target.value);
                                            setFormData({
                                                ...formData,
                                                parentId: e.target.value,
                                                type: parentAccount?.type || formData.type // Inherit type from parent
                                            });
                                        }}
                                    >
                                        <option value="">{t('common.select')}</option>
                                        {accounts
                                            .filter((a) => a.level === formData.level - 1)
                                            .map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.code} - {a.name} ({a.type})
                                                </option>
                                            ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Select a Level {formData.level - 1} account as parent
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('accounts.description')}
                                </label>
                                <textarea
                                    className="input"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Show summary of what will be created */}
                            {formData.level > 1 && formData.parentId && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm font-medium text-blue-900">Account Preview:</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Type: <strong>{accounts.find(a => a.id === formData.parentId)?.type}</strong> (inherited from parent)
                                    </p>
                                    {formData.level === 4 && (
                                        <p className="text-xs text-green-700 mt-1">
                                            ✓ This will be a <strong>Posting Account</strong> (can record transactions)
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({
                                            name: '',
                                            type: AccountType.ASSET,
                                            level: 1,
                                            description: '',
                                        });
                                    }}
                                    className="btn btn-secondary"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {t('common.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;
