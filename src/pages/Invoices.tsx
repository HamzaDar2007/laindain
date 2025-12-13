import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllInvoices,
    selectInvoicesLoading,
} from '../store/invoices/invoicesSelector';
import {
    fetchInvoicesAsync,
    createInvoiceAsync,
    postInvoiceAsync,
    cancelInvoiceAsync,
    deleteInvoiceAsync,
} from '../store/invoices/invoicesSlice';
import { selectPostingAccounts } from '../store/accounts/accountsSelector';
import { fetchPostingAccountsAsync } from '../store/accounts/accountsSlice';
import { CreateInvoiceDto, InvoiceLine } from '../store/invoices/invoicesTypes';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const Invoices: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const invoices = useSelector(selectAllInvoices);
    const postingAccounts = useSelector(selectPostingAccounts);
    const isLoading = useSelector(selectInvoicesLoading);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<CreateInvoiceDto>({

        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        customerName: '',
        customerEmail: '',
        lines: [{ description: '', quantity: 1, unitPrice: 0, amount: 0, accountId: '' }],
        notes: '',
    });

    useEffect(() => {
        dispatch(fetchInvoicesAsync() as any);
        dispatch(fetchPostingAccountsAsync() as any);
    }, [dispatch]);

    const handleAddLine = () => {
        setFormData({
            ...formData,
            lines: [...formData.lines, { description: '', quantity: 1, unitPrice: 0, amount: 0, accountId: '' }],
        });
    };

    const handleLineChange = (index: number, field: keyof InvoiceLine, value: any) => {
        const newLines = [...formData.lines];
        newLines[index] = { ...newLines[index], [field]: value };

        if (field === 'quantity' || field === 'unitPrice') {
            newLines[index].amount = newLines[index].quantity * newLines[index].unitPrice;
        }

        setFormData({ ...formData, lines: newLines });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Remove 'type' from payload as it's not in the DTO
            // Remove 'amount' from lines as backend likely calculates it
            const { type, ...rest } = formData as any;
            const payload = {
                ...rest,
                lines: formData.lines.map(({ amount, ...line }) => line)
            };

            await dispatch(createInvoiceAsync(payload) as any).unwrap();
            await dispatch(fetchInvoicesAsync() as any);

            setShowModal(false);
            setFormData({
                invoiceDate: new Date().toISOString().split('T')[0],
                dueDate: new Date().toISOString().split('T')[0],
                customerName: '',
                customerEmail: '',
                lines: [{ description: '', quantity: 1, unitPrice: 0, amount: 0, accountId: '' }],
                notes: '',
            });
        } catch (error: any) {
            console.error('Failed to create invoice:', error);
            alert(`Failed to create invoice: ${error.message || 'Unknown error'}`);
        }
    };

    const handlePost = async (id: string) => {
        if (window.confirm(t('invoices.confirmPost'))) {
            await dispatch(postInvoiceAsync(id) as any);
        }
    };

    const handleCancel = async (id: string) => {
        if (window.confirm(t('messages.deleteConfirm'))) {
            await dispatch(cancelInvoiceAsync(id) as any);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('messages.deleteConfirm'))) {
            await dispatch(deleteInvoiceAsync(id) as any);
        }
    };

    const totalAmount = formData.lines.reduce((sum, line) => sum + line.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{t('invoices.title')}</h1>
                <Button onClick={() => setShowModal(true)}>
                    {t('invoices.create')}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : (
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{t('invoices.invoiceNumber')}</th>
                                <th>{t('invoices.customer')}</th>
                                <th>{t('invoices.date')}</th>
                                <th>{t('invoices.dueDate')}</th>
                                <th>{t('invoices.totalAmount')}</th>
                                <th>{t('common.status')}</th>
                                <th>{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="font-mono">{invoice.invoiceNumber}</td>
                                    <td>{invoice.customerName}</td>
                                    <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="font-mono">{invoice.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${invoice.status === 'posted' ? 'badge-success' :
                                            invoice.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                                            }`}>
                                            {t(`invoices.statuses.${invoice.status}`)}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        {invoice.status === 'draft' && (
                                            <>
                                                <button onClick={() => handlePost(invoice.id)} className="text-primary-600 hover:text-primary-700 text-sm">
                                                    {t('invoices.post')}
                                                </button>
                                                <button onClick={() => handleDelete(invoice.id)} className="text-danger-600 hover:text-danger-700 text-sm">
                                                    {t('common.delete')}
                                                </button>
                                            </>
                                        )}
                                        {invoice.status === 'posted' && (
                                            <button onClick={() => handleCancel(invoice.id)} className="text-danger-600 hover:text-danger-700 text-sm">
                                                {t('invoices.cancel')}
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
                title={t('invoices.create')}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('invoices.date')}
                            type="date"
                            value={formData.invoiceDate}
                            onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                            required
                        />
                        <Input
                            label={t('invoices.dueDate')}
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label={t('invoices.customer')}
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        required
                    />

                    <Input
                        label={t('invoices.customerEmail')}
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">{t('invoices.lineItems')}</h3>
                            <Button type="button" variant="secondary" size="sm" onClick={handleAddLine}>
                                {t('invoices.addLine')}
                            </Button>
                        </div>

                        {formData.lines.map((line, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                                <div className="col-span-4">
                                    <Input
                                        placeholder={t('invoices.description')}
                                        value={line.description}
                                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        placeholder={t('invoices.quantity')}
                                        value={line.quantity}
                                        onChange={(e) => handleLineChange(index, 'quantity', parseFloat(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder={t('invoices.unitPrice')}
                                        value={line.unitPrice}
                                        onChange={(e) => handleLineChange(index, 'unitPrice', parseFloat(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Select
                                        value={line.accountId}
                                        onChange={(e) => handleLineChange(index, 'accountId', e.target.value)}
                                        required
                                    >
                                        <option value="">{t('common.select')}</option>
                                        {postingAccounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-span-1 flex items-center justify-center font-mono">
                                    {line.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}

                        <div className="text-right font-semibold text-lg mt-4">
                            {t('invoices.total')}: {totalAmount.toFixed(2)}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoices.notes')}</label>
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

export default Invoices;
