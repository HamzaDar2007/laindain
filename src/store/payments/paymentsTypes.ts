export interface Payment {
    id: string;
    paymentNumber: string;
    date: string;
    paymentMethod: 'cash' | 'bank' | 'check' | 'card' | 'other';
    amount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    reference?: string;
    notes?: string;
    accountId: string;
    invoiceId?: string;
    createdAt: string;
    updatedAt: string;
    companyId: string;
    tenantId?: string;
}

export interface PaymentState {
    payments: Payment[];
    currentPayment: Payment | null;
    isLoading: boolean;
    error: string | null;
}

export interface CreatePaymentDto {
    date: string;
    paymentMethod: 'cash' | 'bank' | 'check' | 'card' | 'other';
    amount: number;
    reference?: string;
    notes?: string;
    accountId: string;
    invoiceId?: string;
}

export interface UpdatePaymentDto {
    date?: string;
    paymentMethod?: 'cash' | 'bank' | 'check' | 'card' | 'other';
    amount?: number;
    reference?: string;
    notes?: string;
    accountId?: string;
}
