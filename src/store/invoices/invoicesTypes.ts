export enum InvoiceType {
    SALES = 'sales',
    PURCHASE = 'purchase',
}

export interface Invoice {
    id: string;
    invoiceNo: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    customerId?: string;
    partyId?: string;
    customerName: string;
    customerEmail?: string;
    status: 'draft' | 'sent' | 'paid' | 'cancelled';
    invoiceType: InvoiceType;
    vatRate: number;
    currencyCode: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    invoiceItems: InvoiceItem[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
    companyId: string;
}

export interface InvoiceItem {
    id?: string;
    itemId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    discountPercentage?: number;
    amount?: number;
}

export interface InvoiceState {
    invoices: Invoice[];
    currentInvoice: Invoice | null;
    isLoading: boolean;
    error: string | null;
}

export interface CreateInvoiceDto {
    customerId: string;
    invoiceNumber?: string;
    invoiceType: InvoiceType;
    invoiceDate?: string;
    dueDate?: string;
    vatRate: number;
    currencyCode: string;
    notes?: string;
    invoiceItems: InvoiceItem[];
}

export interface UpdateInvoiceDto extends Partial<CreateInvoiceDto> { }
