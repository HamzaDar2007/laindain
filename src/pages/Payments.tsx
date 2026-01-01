import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllPayments,
    selectPaymentsLoading,
} from '../store/payments/paymentsSelector';
import {
    fetchPaymentsAsync,
    createPaymentAsync,
    confirmPaymentAsync,
    cancelPaymentAsync,
    deletePaymentAsync,
} from '../store/payments/paymentsSlice';
import { selectPostingAccounts } from '../store/accounts/accountsSelector';
import { fetchPostingAccountsAsync } from '../store/accounts/accountsSlice';
import { selectAllInvoices } from '../store/invoices/invoicesSelector';
import { fetchInvoicesAsync } from '../store/invoices/invoicesSlice';
import { CreatePaymentDto } from '../store/payments/paymentsTypes';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const Payments: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const payments = useSelector(selectAllPayments);
    const postingAccounts = useSelector(selectPostingAccounts);
    const invoices = useSelector(selectAllInvoices);
    const isLoading = useSelector(selectPaymentsLoading);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<CreatePaymentDto>({
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        amount: 0,
        reference: '',
        notes: '',
        accountId: '',
        invoiceId: '',
    });

    useEffect(() => {
        dispatch(fetchPaymentsAsync() as any);
        dispatch(fetchPostingAccountsAsync() as any);
        dispatch(fetchInvoicesAsync() as any);
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(createPaymentAsync(formData) as any);
        setShowModal(false);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'cash',
            amount: 0,
            reference: '',
            notes: '',
            accountId: '',
            invoiceId: '',
        });
    };

    const handleConfirm = async (id: string) => {
        if (window.confirm(t('payments.confirmPayment'))) {
            await dispatch(confirmPaymentAsync(id) as any);
        }
    };

    const handleCancel = async (id: string) => {
        if (window.confirm(t('messages.deleteConfirm'))) {
            await dispatch(cancelPaymentAsync(id) as any);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('messages.deleteConfirm'))) {
            await dispatch(deletePaymentAsync(id) as any);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 data-testid="payments-title" className="text-3xl font-bold text-slate-900 dark:text-white">{t('payments.title')}</h1>
                <Button onClick={() => setShowModal(true)}>
                    {t('payments.create')}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : (
                <div className="card">
                    <table data-testid="payments-table" className="table">
                        <thead>
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('payments.paymentNumber')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('payments.date')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('payments.paymentMethod')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('payments.amount')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('payments.reference')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.status')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="font-mono">{payment.paymentNumber}</td>
                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                    <td className="capitalize">{payment.paymentMethod}</td>
                                    <td className="font-mono">{payment.amount.toFixed(2)}</td>
                                    <td>{payment.reference || '-'}</td>
                                    <td>
                                        <span className={`badge ${payment.status === 'confirmed' ? 'badge-success' :
                                            payment.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                                            }`}>
                                            {t(`payments.statuses.${payment.status}`)}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        {payment.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleConfirm(payment.id)} className="text-primary-600 hover:text-primary-700 text-sm">
                                                    {t('payments.confirm')}
                                                </button>
                                                <button onClick={() => handleDelete(payment.id)} className="text-danger-600 hover:text-danger-700 text-sm">
                                                    {t('common.delete')}
                                                </button>
                                            </>
                                        )}
                                        {payment.status === 'confirmed' && (
                                            <button onClick={() => handleCancel(payment.id)} className="text-danger-600 hover:text-danger-700 text-sm">
                                                {t('payments.cancel')}
                                            </button>
                                        )}
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
                title={t('payments.create')}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('payments.date')}
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />

                    <Select
                        label={t('payments.paymentMethod')}
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                        required
                    >
                        <option value="cash">{t('payments.methods.cash')}</option>
                        <option value="bank">{t('payments.methods.bank')}</option>
                        <option value="check">{t('payments.methods.check')}</option>
                        <option value="card">{t('payments.methods.card')}</option>
                        <option value="other">{t('payments.methods.other')}</option>
                    </Select>

                    <Input
                        label={t('payments.amount')}
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        required
                    />

                    <Select
                        label={t('payments.account')}
                        value={formData.accountId}
                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                        required
                    >
                        <option value="">{t('common.select')}</option>
                        {postingAccounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                        ))}
                    </Select>

                    <Select
                        label={t('invoices.title')}
                        value={formData.invoiceId}
                        onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                    >
                        <option value="">{t('common.none')}</option>
                        {invoices.filter(inv => inv.status === 'sent').map(inv => (
                            <option key={inv.id} value={inv.id}>{inv.invoiceNumber} - {inv.customerName}</option>
                        ))}
                    </Select>

                    <Input
                        label={t('payments.reference')}
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('payments.notes')}</label>
                        <textarea
                            className="input"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

export default Payments;
