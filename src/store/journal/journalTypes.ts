export enum JournalStatus {
    DRAFT = 'draft',
    POSTED = 'posted',
    CANCELLED = 'cancelled',
    REVERSED = 'reversed',
}

export interface JournalLine {
    id?: string;
    accountId: string;
    account?: any;
    debit: number;
    credit: number;
    narration?: string;
}

export interface JournalEntry {
    id: string;
    tenantId: string;
    voucherNumber: string;
    date: string;
    voucherTypeId?: string;
    reference?: string;
    description: string;
    status: JournalStatus;
    totalDebit: number;
    totalCredit: number;
    lines: JournalLine[];
    createdBy: string;
    postedBy?: string;
    postedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateJournalEntryDto {
    date: string;
    voucherTypeId?: string;
    reference?: string;
    description: string;
    lines: JournalLine[];
}

export interface JournalState {
    entries: JournalEntry[];
    isLoading: boolean;
    error: string | null;
}
