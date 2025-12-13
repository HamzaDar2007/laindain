import { createSlice } from '@reduxjs/toolkit';
import { JournalState, CreateJournalEntryDto } from './journalTypes';
import { createAppAsyncThunk } from '../common/storeUtils';
import { journalApi } from './journalApi';

const initialState: JournalState = {
    entries: [],
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchJournalsAsync = createAppAsyncThunk(
    'journal/fetchAll',
    async () => {
        return await journalApi.fetchJournals();
    }
);

export const createJournalAsync = createAppAsyncThunk(
    'journal/create',
    async (data: CreateJournalEntryDto) => {
        return await journalApi.createJournal(data);
    }
);

export const updateJournalAsync = createAppAsyncThunk(
    'journal/update',
    async ({ id, data }: { id: string; data: Partial<CreateJournalEntryDto> }) => {
        return await journalApi.updateJournal(id, data);
    }
);

export const postJournalAsync = createAppAsyncThunk(
    'journal/post',
    async (id: string) => {
        return await journalApi.postJournal(id);
    }
);

export const reverseJournalAsync = createAppAsyncThunk(
    'journal/reverse',
    async (id: string) => {
        return await journalApi.reverseJournal(id);
    }
);

export const cancelJournalAsync = createAppAsyncThunk(
    'journal/cancel',
    async (id: string) => {
        return await journalApi.cancelJournal(id);
    }
);

export const deleteJournalAsync = createAppAsyncThunk(
    'journal/delete',
    async (id: string) => {
        await journalApi.deleteJournal(id);
        return id;
    }
);

const journalSlice = createSlice({
    name: 'journal',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch journals
        builder.addCase(fetchJournalsAsync.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchJournalsAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            state.entries = action.payload;
        });
        builder.addCase(fetchJournalsAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create journal
        builder.addCase(createJournalAsync.fulfilled, (state, action) => {
            state.entries.unshift(action.payload);
        });

        // Update journal
        builder.addCase(updateJournalAsync.fulfilled, (state, action) => {
            const index = state.entries.findIndex((e) => e.id === action.payload.id);
            if (index !== -1) {
                state.entries[index] = action.payload;
            }
        });

        // Post journal
        builder.addCase(postJournalAsync.fulfilled, (state, action) => {
            const index = state.entries.findIndex((e) => e.id === action.payload.id);
            if (index !== -1) {
                state.entries[index] = action.payload;
            }
        });

        // Reverse journal
        builder.addCase(reverseJournalAsync.fulfilled, (state, action) => {
            const index = state.entries.findIndex((e) => e.id === action.payload.id);
            if (index !== -1) {
                state.entries[index] = action.payload;
            }
        });

        // Cancel journal
        builder.addCase(cancelJournalAsync.fulfilled, (state, action) => {
            const index = state.entries.findIndex((e) => e.id === action.payload.id);
            if (index !== -1) {
                state.entries[index] = action.payload;
            }
        });

        // Delete journal
        builder.addCase(deleteJournalAsync.fulfilled, (state, action) => {
            state.entries = state.entries.filter((e) => e.id !== action.payload);
        });
    },
});

export default journalSlice.reducer;
