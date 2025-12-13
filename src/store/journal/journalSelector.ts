import { RootState } from '../index';

export const selectAllJournals = (state: RootState) => state.journal.entries;
export const selectJournalsLoading = (state: RootState) => state.journal.isLoading;
export const selectJournalsError = (state: RootState) => state.journal.error;

// Get journal by ID
export const selectJournalById = (id: string) => (state: RootState) =>
    state.journal.entries.find((entry) => entry.id === id);

// Get journals by status
export const selectJournalsByStatus = (status: string) => (state: RootState) =>
    state.journal.entries.filter((entry) => entry.status === status);
