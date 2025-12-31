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
    markInvoiceAsSentAsync,
    markInvoiceAsPaidAsync,
    deleteInvoiceAsync,
} from '../store/invoices/invoicesSlice';
import { CreateInvoiceDto, InvoiceItem, InvoiceType, Invoice } from '../store/invoices/invoicesTypes';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import PageHeader from '../components/common/PageHeader';
import Select from '../components/common/Select';

const Invoices: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const invoices = useSelector(selectAllInvoices);
    const isLoading = useSelector(selectInvoicesLoading);

    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [formData, setFormData] = useState<CreateInvoiceDto>({
        customerId: '',
        invoiceType: InvoiceType.SALES,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        vatRate: 5,
        currencyCode: 'AED',
        invoiceItems: [{ description: '', quantity: 1, unitPrice: 0, vatRate: 5 }],
        notes: '',
    });

    useEffect(() => {
        dispatch(fetchInvoicesAsync() as any);
    }, [dispatch]);

    const handleAddLine = () => {
        setFormData({
            ...formData,
            invoiceItems: [...formData.invoiceItems, { description: '', quantity: 1, unitPrice: 0, vatRate: formData.vatRate }],
        });
    };

    const handleLineChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newLines = [...formData.invoiceItems];
        newLines[index] = { ...newLines[index], [field]: value };
        setFormData({ ...formData, invoiceItems: newLines });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(createInvoiceAsync(formData) as any).unwrap();
            await dispatch(fetchInvoicesAsync() as any);

            setShowModal(false);
            setFormData({
                customerId: '',
                invoiceType: InvoiceType.SALES,
                invoiceDate: new Date().toISOString().split('T')[0],
                dueDate: new Date().toISOString().split('T')[0],
                vatRate: 5,
                currencyCode: 'AED',
                invoiceItems: [{ description: '', quantity: 1, unitPrice: 0, vatRate: 5 }],
                notes: '',
            });
        } catch (error: any) {
            console.error('Failed to create invoice:', error);
            alert(`Failed to create invoice: ${error.message || 'Unknown error'}`);
        }
    };

    const handleMarkAsSent = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(t('invoices.confirmPost'))) {
            await dispatch(markInvoiceAsSentAsync(id) as any);
        }
    };

    const handleMarkAsPaid = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(t('invoices.confirmPaid'))) {
            await dispatch(markInvoiceAsPaidAsync(id) as any);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(t('messages.deleteConfirm'))) {
            await dispatch(deleteInvoiceAsync(id) as any);
        }
    };

    const totalAmount = formData.invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (1 + item.vatRate / 100)), 0);

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            key: 'invoiceNo',
            header: t('invoices.invoiceNumber'),
            render: (invoice: Invoice) => <span className="font-mono font-medium text-primary-600 dark:text-primary-400">{invoice.invoiceNo}</span>,
            sortable: true,
        },
        {
            key: 'customerName',
            header: t('invoices.customer'),
            sortable: true,
        },
        {
            key: 'date',
            header: t('invoices.date'),
            render: (invoice: Invoice) => new Date(invoice.invoiceDate).toLocaleDateString(),
            sortable: true,
        },
        {
            key: 'dueDate',
            header: t('invoices.dueDate'),
            render: (invoice: Invoice) => new Date(invoice.dueDate).toLocaleDateString(),
            sortable: true,
        },
        {
            key: 'totalAmount',
            header: t('invoices.totalAmount'),
            render: (invoice: Invoice) => <span className="font-mono font-semibold">{Number(invoice.totalAmount).toFixed(2)}</span>,
            sortable: true,
        },
        {
            key: 'status',
            header: t('common.status'),
            render: (invoice: Invoice) => (
                <span className={`badge ${invoice.status === 'sent' ? 'badge-info' :
                        invoice.status === 'paid' ? 'badge-success' :
                            invoice.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                    }`}>
                    {t(`invoices.statuses.${invoice.status}`)}
                </span>
            ),
            sortable: true,
        },
        {
            key: 'actions',
            header: t('common.actions'),
            render: (invoice: Invoice) => (
                <div className="flex items-center gap-2">
                    {invoice.status === 'draft' && (
                        <>
                            <button onClick={(e) => handleMarkAsSent(invoice.id, e)} className="p-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors" title={t('invoices.post')}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button onClick={(e) => handleDelete(invoice.id, e)} className="p-1 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded transition-colors" title={t('common.delete')}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </>
                    )}
                    {invoice.status === 'sent' && (
                        <button onClick={(e) => handleMarkAsPaid(invoice.id, e)} className="p-1 text-success-600 hover:text-success-700 hover:bg-success-50 rounded transition-colors" title={t('invoices.paid')}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            ),
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title={t('invoices.title')}
                description="Manage your invoices, payments, and customers."
                actions={
                    <Button onClick={() => setShowModal(true)} className="shadow-lg hover:shadow-primary-500/30">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('invoices.create')}
                    </Button>
                }
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="pl-10 input w-full"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: 'all', label: 'All Statuses' },
                            { value: 'draft', label: 'Draft' },
                            { value: 'sent', label: 'Sent' },
                            { value: 'paid', label: 'Paid' },
                            { value: 'cancelled', label: 'Cancelled' },
                        ]}
                    />
                </div>
            </div>

            <Table
                data={filteredInvoices}
                columns={columns}
                loading={isLoading}
                emptyMessage="No invoices found matching your criteria."
            />

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={t('invoices.create')}
                size="4xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={t('invoices.date')}
                            type="date"
                            name="invoiceDate"
                            value={formData.invoiceDate}
                            onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                        />
                        <Input
                            label={t('invoices.dueDate')}
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>

                    <Input
                        label={t('invoices.customer')}
                        name="customerId"
                        placeholder="Customer ID or Search"
                        value={formData.customerId}
                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={t('invoices.vatRate')}
                            type="number"
                            value={formData.vatRate}
                            onChange={(e) => setFormData({ ...formData, vatRate: parseFloat(e.target.value) })}
                        />
                        <Input
                            label={t('invoices.currency')}
                            value={formData.currencyCode}
                            onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                        />
                    </div>

                    <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{t('invoices.lineItems')}</h3>
                            <Button type="button" variant="secondary" size="sm" onClick={handleAddLine}>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {t('invoices.addLine')}
                            </Button>
                        </div>

                        {formData.invoiceItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-3 mb-3 items-start animate-fade-in">
                                <div className="col-span-5">
                                    <Input
                                        placeholder={t('invoices.description')}
                                        value={item.description}
                                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                        required
                                        className="bg-white dark:bg-gray-800"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        placeholder="Qty"
                                        value={item.quantity}
                                        onChange={(e) => handleLineChange(index, 'quantity', parseFloat(e.target.value))}
                                        required
                                        className="bg-white dark:bg-gray-800"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Price"
                                        value={item.unitPrice}
                                        onChange={(e) => handleLineChange(index, 'unitPrice', parseFloat(e.target.value))}
                                        required
                                        className="bg-white dark:bg-gray-800"
                                    />
                                </div>
                                <div className="col-span-2 flex items-center justify-end h-10 font-mono font-medium text-gray-700 dark:text-gray-300">
                                    {(item.quantity * item.unitPrice * (1 + item.vatRate / 100)).toFixed(2)}
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-gray-500 mr-4">Total Amount</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoices.notes')}</label>
                        <textarea
                            className="input w-full"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Add any notes relevant to this invoice..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" className="shadow-lg shadow-primary-500/20">
                            {t('common.save')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Invoices;
