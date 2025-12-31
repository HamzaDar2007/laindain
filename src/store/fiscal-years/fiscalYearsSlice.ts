import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as fiscalYearsApi from './fiscalYearsApi';
import { CreateFiscalYearDto, FiscalYear, FiscalYearsState } from './fiscalYearsTypes';

const initialState: FiscalYearsState = {
    years: [],
    currentYear: null,
    isLoading: false,
    error: null,
};

export const fetchFiscalYearsAsync = createAsyncThunk(
    'fiscalYears/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await fiscalYearsApi.fetchFiscalYears();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch fiscal years');
        }
    }
);

export const fetchCurrentFiscalYearAsync = createAsyncThunk(
    'fiscalYears/fetchCurrent',
    async (_, { rejectWithValue }) => {
        try {
            return await fiscalYearsApi.fetchCurrentFiscalYear();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch current fiscal year');
        }
    }
);

export const createFiscalYearAsync = createAsyncThunk(
    'fiscalYears/create',
    async (data: CreateFiscalYearDto, { rejectWithValue }) => {
        try {
            return await fiscalYearsApi.createFiscalYear(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create fiscal year');
        }
    }
);

export const closeFiscalYearAsync = createAsyncThunk(
    'fiscalYears/close',
    async (id: string, { rejectWithValue }) => {
        try {
            return await fiscalYearsApi.closeFiscalYear(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to close fiscal year');
        }
    }
);

export const openFiscalYearAsync = createAsyncThunk(
    'fiscalYears/open',
    async (id: string, { rejectWithValue }) => {
        try {
            return await fiscalYearsApi.openFiscalYear(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to open fiscal year');
        }
    }
);

const fiscalYearsSlice = createSlice({
    name: 'fiscalYears',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFiscalYearsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFiscalYearsAsync.fulfilled, (state, action: PayloadAction<FiscalYear[]>) => {
                state.isLoading = false;
                state.years = action.payload;
            })
            .addCase(fetchFiscalYearsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCurrentFiscalYearAsync.fulfilled, (state, action: PayloadAction<FiscalYear>) => {
                state.currentYear = action.payload;
            })
            .addCase(createFiscalYearAsync.fulfilled, (state, action: PayloadAction<FiscalYear>) => {
                state.years.unshift(action.payload);
            })
            .addCase(closeFiscalYearAsync.fulfilled, (state, action: PayloadAction<FiscalYear>) => {
                const index = state.years.findIndex((y) => y.id === action.payload.id);
                if (index !== -1) {
                    state.years[index] = action.payload;
                }
            })
            .addCase(openFiscalYearAsync.fulfilled, (state, action: PayloadAction<FiscalYear>) => {
                const index = state.years.findIndex((y) => y.id === action.payload.id);
                if (index !== -1) {
                    state.years[index] = action.payload;
                }
            });
    },
});

export default fiscalYearsSlice.reducer;
