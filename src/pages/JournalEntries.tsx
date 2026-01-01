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
import Modal from '../components/common/Modal';

const JournalEntries: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const journals = useSelector(selectAllJournals);
    const postingAccounts = useSelector(selectPostingAccounts);
    const voucherTypes = useSelector(selectAllVoucherTypes);
    const isLoading = useSelector(selectJournalsLoading);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<CreateJournalEntryDto>({
        entryDate: new Date().toISOString().split('T')[0],
        postingDate: new Date().toISOString().split('T')[0],
        description: '',
        voucherTypeId: '',
        voucherNo: '',
        lines: [
            { accountId: '', debit: 0, credit: 0, description: '' },
            { accountId: '', debit: 0, credit: 0, description: '' },
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
            lines: [...formData.lines, { accountId: '', debit: 0, credit: 0, description: '' }],
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

    const getTotalDebit = () => formData.lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
    const getTotalCredit = () => formData.lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
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
            entryDate: new Date().toISOString().split('T')[0],
            postingDate: new Date().toISOString().split('T')[0],
            description: '',
            voucherTypeId: voucherTypes.length > 0 ? voucherTypes[0].id : '',
            voucherNo: '',
            reference: '',
            lines: [
                { accountId: '', debit: 0, credit: 0, description: '' },
                { accountId: '', debit: 0, credit: 0, description: '' },
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
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('journal.voucherNumber')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('journal.date')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('journal.description')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('journal.totalDebit')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('journal.totalCredit')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('journal.status')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journals.map((journal) => (
                                <tr key={journal.id}>
                                    <td className="font-mono">{journal.voucherNo}</td>
                                    <td>{formatDate(journal.entryDate)}</td>
                                    <td>{journal.description}</td>
                                    <td className="font-mono text-slate-600 dark:text-slate-400">{Number(journal.totalDebit).toFixed(2)}</td>
                                    <td className="font-mono text-slate-600 dark:text-slate-400">{Number(journal.totalCredit).toFixed(2)}</td>
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
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={t('journal.create')}
                size="4xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {t('journal.date')}
                            </label>
                            <input
                                type="date"
                                name="entryDate"
                                data-testid="entryDate"
                                required
                                className="input"
                                value={formData.entryDate}
                                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value, postingDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {t('voucherTypes.title')}
                            </label>
                            <select
                                required
                                name="voucherTypeId"
                                data-testid="voucherTypeId"
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t('journal.voucherNo')}
                        </label>
                        <input
                            type="text"
                            name="voucherNo"
                            data-testid="voucherNo"
                            required
                            className="input font-mono"
                            placeholder="AUTO-GENERATED"
                            value={formData.voucherNo || ''}
                            onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t('journal.description')}
                        </label>
                        <input
                            type="text"
                            name="description"
                            data-testid="description"
                            required
                            className="input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {t('journal.lines')}
                            </label>
                            <button type="button" onClick={addLine} className="btn btn-secondary text-sm">
                                {t('journal.addLine')}
                            </button>
                        </div>

                        <div className="space-y-2">
                            {formData.lines.map((line, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="col-span-4">
                                        <select
                                            required
                                            name={`accountId-${index}`}
                                            data-testid={`accountId-${index}`}
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
                                            name={`debit-${index}`}
                                            data-testid={`debit-${index}`}
                                            placeholder={t('journal.debit')}
                                            className="input text-sm"
                                            value={line.debit || ''}
                                            onChange={(e) => updateLine(index, 'debit', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            name={`credit-${index}`}
                                            data-testid={`credit-${index}`}
                                            placeholder={t('journal.credit')}
                                            className="input text-sm"
                                            value={line.credit || ''}
                                            onChange={(e) => updateLine(index, 'credit', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            placeholder={t('journal.description')}
                                            className="input text-sm"
                                            value={line.description || ''}
                                            onChange={(e) => updateLine(index, 'description', e.target.value)}
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

                        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
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
            </Modal>
        </div>
    );
};

export default JournalEntries;
