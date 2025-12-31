import { apiClient } from '../common/apiHelper';
import { JournalEntry, CreateJournalEntryDto } from './journalTypes';

export const journalApi = {
    async fetchJournals(): Promise<JournalEntry[]> {
        return apiClient.get<JournalEntry[]>('/journal-entries');
    },

    async getJournal(id: string): Promise<JournalEntry> {
        return apiClient.get<JournalEntry>(`/journal-entries/${id}`);
    },

    async createJournal(data: CreateJournalEntryDto): Promise<JournalEntry> {
        return apiClient.post<JournalEntry>('/journal-entries', data);
    },

    async updateJournal(id: string, data: Partial<CreateJournalEntryDto>): Promise<JournalEntry> {
        return apiClient.patch<JournalEntry>(`/journal-entries/${id}`, data);
    },

    async postJournal(id: string): Promise<JournalEntry> {
        return apiClient.patch<JournalEntry>(`/journal-entries/${id}/post`, {});
    },

    async reverseJournal(id: string): Promise<JournalEntry> {
        return apiClient.post<JournalEntry>(`/journal-entries/${id}/reverse`, {});
    },

    async cancelJournal(id: string): Promise<JournalEntry> {
        return apiClient.post<JournalEntry>(`/journal-entries/${id}/cancel`, {});
    },

    async deleteJournal(id: string): Promise<void> {
        return apiClient.delete<void>(`/journal-entries/${id}`);
    },
};
