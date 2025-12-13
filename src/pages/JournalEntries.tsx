import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllJournals,
    selectJournalsLoading,
} from '../store/journal/journalSelector';
import {
    fetchJournalsAsync,
    createJournalAsync,
    postJournalAsync,
    deleteJournalAsync,
} from '../store/journal/journalSlice';
import { selectPostingAccounts } from '../store/accounts/accountsSelector';

import { fetchPostingAccountsAsync } from '../store/accounts/accountsSlice';
import { selectAllVoucherTypes } from '../store/voucher-types/voucherTypesSelector';
import { fetchVoucherTypesAsync } from '../store/voucher-types/voucherTypesSlice';
import { CreateJournalEntryDto, JournalLine } from '../store/journal/journalTypes';
import { formatDate } from '../utils/formatters';

const JournalEntries: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const journals = useSelector(selectAllJournals);
    const postingAccounts = useSelector(selectPostingAccounts);
    const voucherTypes = useSelector(selectAllVoucherTypes);
    const isLoading = useSelector(selectJournalsLoading);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<CreateJournalEntryDto>({
        date: new Date().toISOString().split('T')[0],
        description: '',
        voucherTypeId: '',
        lines: [
            { accountId: '', debit: 0, credit: 0, narration: '' },
            { accountId: '', debit: 0, credit: 0, narration: '' },
        ],
    });

    useEffect(() => {
        dispatch(fetchJournalsAsync() as any);
        dispatch(fetchPostingAccountsAsync() as any);
        dispatch(fetchVoucherTypesAsync() as any);
    }, [dispatch]);

    // Set default voucher type when available
    useEffect(() => {
        if (voucherTypes.length > 0 && !formData.voucherTypeId) {
            setFormData(prev => ({ ...prev, voucherTypeId: voucherTypes[0].id }));
        }
    }, [voucherTypes, showModal]);

    const addLine = () => {
        setFormData({
            ...formData,
            lines: [...formData.lines, { accountId: '', debit: 0, credit: 0, narration: '' }],
        });
    };

    const updateLine = (index: number, field: keyof JournalLine, value: any) => {
        const newLines = [...formData.lines];
        newLines[index] = { ...newLines[index], [field]: value };
        setFormData({ ...formData, lines: newLines });
    };

    const removeLine = (index: number) => {
        if (formData.lines.length > 2) {
            const newLines = formData.lines.filter((_, i) => i !== index);
            setFormData({ ...formData, lines: newLines });
        }
    };

    const getTotalDebit = () => formData.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const getTotalCredit = () => formData.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    const isBalanced = () => Math.abs(getTotalDebit() - getTotalCredit()) < 0.01;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isBalanced()) {
            alert(t('journal.validation.balanceRequired'));
            return;
        }

        await dispatch(createJournalAsync(formData) as any);
        await dispatch(fetchJournalsAsync() as any);
        setShowModal(false);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            description: '',
            voucherTypeId: voucherTypes.length > 0 ? voucherTypes[0].id : '',
            reference: '', // Reset reference
            lines: [
                { accountId: '', debit: 0, credit: 0, narration: '' },
                { accountId: '', debit: 0, credit: 0, narration: '' },
            ],
        });
    };

    const handlePost = async (id: string) => {
        if (window.confirm(t('journal.confirmPost'))) {
            await dispatch(postJournalAsync(id) as any);
            await dispatch(fetchJournalsAsync() as any);
        }
    };

    const onDeleteJournal = async (id: string) => {
        if (window.confirm(t('common.confirmDelete'))) {
            await dispatch(deleteJournalAsync(id) as any);
            await dispatch(fetchJournalsAsync() as any);
        }
    };

    // ... render methods ... 

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{t('journal.title')}</h1>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    {t('journal.create')}
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{t('journal.voucherNumber')}</th>
                                <th>{t('journal.date')}</th>
                                <th>{t('journal.description')}</th>
                                <th>{t('journal.totalDebit')}</th>
                                <th>{t('journal.totalCredit')}</th>
                                <th>{t('journal.status')}</th>
                                <th>{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journals.map((journal) => (
                                <tr key={journal.id}>
                                    <td className="font-mono">{journal.voucherNumber}</td>
                                    <td>{formatDate(journal.date)}</td>
                                    <td>{journal.description}</td>
                                    <td className="font-mono">{Number(journal.totalDebit).toFixed(2)}</td>
                                    <td className="font-mono">{Number(journal.totalCredit).toFixed(2)}</td>
                                    <td>
                                        <span className={`badge badge-${journal.status === 'posted' ? 'success' : 'warning'}`}>
                                            {t(`journal.statuses.${journal.status}`)}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        {journal.status === 'draft' && (
                                            <button
                                                onClick={() => handlePost(journal.id)}
                                                className="text-success-600 hover:text-success-700 text-sm"
                                            >
                                                {t('journal.post')}
                                            </button>
                                        )}
                                        {journal.status === 'draft' && (
                                            <button
                                                onClick={() => onDeleteJournal(journal.id)}
                                                className="text-danger-600 hover:text-danger-700 text-sm"
                                            >
                                                {t('common.delete')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Journal Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
                        <h2 className="text-2xl font-bold mb-4">{t('journal.create')}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('journal.date')}
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="input"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('voucherTypes.title')}
                                    </label>
                                    <select
                                        required
                                        className="input"
                                        value={formData.voucherTypeId}
                                        onChange={(e) => setFormData({ ...formData, voucherTypeId: e.target.value })}
                                    >
                                        <option value="">{t('common.select')}</option>
                                        {voucherTypes.map(vt => (
                                            <option key={vt.id} value={vt.id}>{vt.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('journal.reference')}
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.reference || ''}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('journal.description')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('journal.lines')}
                                    </label>
                                    <button type="button" onClick={addLine} className="btn btn-secondary text-sm">
                                        {t('journal.addLine')}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {formData.lines.map((line, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-lg">
                                            <div className="col-span-4">
                                                <select
                                                    required
                                                    className="input text-sm"
                                                    value={line.accountId}
                                                    onChange={(e) => updateLine(index, 'accountId', e.target.value)}
                                                >
                                                    <option value="">{t('journal.account')}</option>
                                                    {postingAccounts.map((acc) => (
                                                        <option key={acc.id} value={acc.id}>
                                                            {acc.code} - {acc.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder={t('journal.debit')}
                                                    className="input text-sm"
                                                    value={line.debit || ''}
                                                    onChange={(e) => updateLine(index, 'debit', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder={t('journal.credit')}
                                                    className="input text-sm"
                                                    value={line.credit || ''}
                                                    onChange={(e) => updateLine(index, 'credit', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    placeholder={t('journal.narration')}
                                                    className="input text-sm"
                                                    value={line.narration || ''}
                                                    onChange={(e) => updateLine(index, 'narration', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                {formData.lines.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLine(index)}
                                                        className="text-danger-600 hover:text-danger-700"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{t('journal.totalDebit')}:</span>
                                        <span className="font-mono">{getTotalDebit().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="font-medium">{t('journal.totalCredit')}:</span>
                                        <span className="font-mono">{getTotalCredit().toFixed(2)}</span>
                                    </div>
                                    {!isBalanced() && (
                                        <div className="mt-2 text-danger-600 text-sm">
                                            {t('journal.validation.balanceRequired')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-secondary"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={!isBalanced()}>
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

export default JournalEntries;
