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
    debit: number | string;
    credit: number | string;
    description?: string;
    partyId?: string;
}

export interface JournalEntry {
    id: string;
    companyId: string;
    voucherNo: string;
    entryDate: string;
    postingDate: string;
    voucherTypeId: string;
    reference?: string;
    description?: string;
    status: JournalStatus;
    totalDebit?: number;
    totalCredit?: number;
    lines: JournalLine[];
    createdBy: string;
    postedBy?: string;
    postedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateJournalEntryDto {
    voucherTypeId: string;
    voucherNo: string;
    entryDate: string;
    postingDate: string;
    reference?: string;
    description?: string;
    lines: JournalLine[];
}

export interface JournalState {
    entries: JournalEntry[];
    isLoading: boolean;
    error: string | null;
}
