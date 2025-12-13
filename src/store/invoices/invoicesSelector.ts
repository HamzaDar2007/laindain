import { RootState } from '../index';

export const selectAllInvoices = (state: RootState) => state.invoices.invoices;
export const selectCurrentInvoice = (state: RootState) => state.invoices.currentInvoice;
export const selectInvoicesLoading = (state: RootState) => state.invoices.isLoading;
export const selectInvoicesError = (state: RootState) => state.invoices.error;

export const selectInvoiceById = (state: RootState, id: string) =>
    state.invoices.invoices.find(inv => inv.id === id);

export const selectInvoicesByStatus = (state: RootState, status: 'draft' | 'posted' | 'cancelled') =>
    state.invoices.invoices.filter(inv => inv.status === status);

export const selectDraftInvoices = (state: RootState) =>
    state.invoices.invoices.filter(inv => inv.status === 'draft');

export const selectPostedInvoices = (state: RootState) =>
    state.invoices.invoices.filter(inv => inv.status === 'posted');
