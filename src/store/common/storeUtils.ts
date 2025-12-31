import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { handleApiError } from './apiHelper';

// Generic async thunk creator with error handling
export function createAppAsyncThunk<Returned, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: (arg: ThunkArg) => Promise<Returned>
): AsyncThunk<Returned, ThunkArg, object> {
    return createAsyncThunk<Returned, ThunkArg>(
        typePrefix,
        async (arg, { rejectWithValue }) => {
            try {
                return await payloadCreator(arg);
            } catch (error) {
                return rejectWithValue(handleApiError(error));
            }
        }
    );
}

// Re-export for convenience
export { handleApiError };

// Helper to create loading state
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export const initialLoadingState: LoadingState = {
    isLoading: false,
    error: null,
};

// Helper to set loading state
export function setLoading(state: any) {
    state.isLoading = true;
    state.error = null;
}

// Helper to set error state
export function setError(state: any, error: string) {
    state.isLoading = false;
    state.error = error;
}

// Helper to set success state
export function setSuccess(state: any) {
    state.isLoading = false;
    state.error = null;
}
