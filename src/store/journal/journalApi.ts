import { apiClient } from '../common/apiHelper';
import { JournalEntry, CreateJournalEntryDto } from './journalTypes';

export const journalApi = {
    async fetchJournals(): Promise<JournalEntry[]> {
        return apiClient.get<JournalEntry[]>('/accounting/journal');
    },

    async getJournal(id: string): Promise<JournalEntry> {
        return apiClient.get<JournalEntry>(`/accounting/journal/${id}`);
    },

    async createJournal(data: CreateJournalEntryDto): Promise<JournalEntry> {
        // Transform frontend DTO to backend DTO
        const backendData = {
            ...data,
            voucherTypeId: data.voucherTypeId || '00000000-0000-0000-0000-000000000000', // Placeholder if missing, needs real ID
            lines: data.lines.flatMap(line => {
                const result = [];
                if (line.debit > 0) {
                    result.push({
                        accountId: line.accountId,
                        nature: 'debit',
                        amount: line.debit,
                        description: line.narration
                    });
                }
                if (line.credit > 0) {
                    result.push({
                        accountId: line.accountId,
                        nature: 'credit',
                        amount: line.credit,
                        description: line.narration
                    });
                }
                return result;
            })
        };
        return apiClient.post<JournalEntry>('/accounting/journal', backendData);
    },

    async updateJournal(id: string, data: Partial<CreateJournalEntryDto>): Promise<JournalEntry> {
        return apiClient.patch<JournalEntry>(`/accounting/journal/${id}`, data);
    },

    async postJournal(id: string): Promise<JournalEntry> {
        return apiClient.post<JournalEntry>(`/accounting/journal/${id}/post`, {});
    },

    async reverseJournal(id: string): Promise<JournalEntry> {
        return apiClient.post<JournalEntry>(`/accounting/journal/${id}/reverse`, {});
    },

    async cancelJournal(id: string): Promise<JournalEntry> {
        return apiClient.post<JournalEntry>(`/accounting/journal/${id}/cancel`, {});
    },

    async deleteJournal(id: string): Promise<void> {
        return apiClient.delete<void>(`/accounting/journal/${id}`);
    },
};
