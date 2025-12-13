export interface Invoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    customerId?: string;
    customerName: string;
    customerEmail?: string;
    customerAddress?: string;
    status: 'draft' | 'posted' | 'cancelled';
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    lines: InvoiceLine[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
    tenantId: string;
}

export interface InvoiceLine {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    accountId: string;
    taxRate?: number;
}

export interface InvoiceState {
    invoices: Invoice[];
    currentInvoice: Invoice | null;
    isLoading: boolean;
    error: string | null;
}

export interface CreateInvoiceDto {
    invoiceDate: string;
    dueDate: string;
    customerName: string;
    customerEmail?: string;
    customerAddress?: string;
    lines: Omit<InvoiceLine, 'id'>[];
    notes?: string;
}

export interface UpdateInvoiceDto {
    invoiceDate?: string;
    dueDate?: string;
    customerName?: string;
    customerEmail?: string;
    customerAddress?: string;
    lines?: Omit<InvoiceLine, 'id'>[];
    notes?: string;
}
