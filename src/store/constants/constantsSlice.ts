import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { constantsApi } from './constantsApi';
import { CreateConstantDto, ConstantsState } from './constantsTypes';
import { handleApiError } from '../common/storeUtils';

const initialState: ConstantsState = {
    constants: [],
    loading: false,
    error: null,
};

export const fetchConstantsAsync = createAsyncThunk(
    'constants/fetchConstants',
    async (type?: string) => {
        return await constantsApi.fetchConstants(type);
    }
);

export const createConstantAsync = createAsyncThunk(
    'constants/createConstant',
    async (data: CreateConstantDto) => {
        return await constantsApi.createConstant(data);
    }
);

export const updateConstantAsync = createAsyncThunk(
    'constants/updateConstant',
    async ({ id, data }: { id: string; data: Partial<CreateConstantDto> }) => {
        return await constantsApi.updateConstant(id, data);
    }
);

export const deleteConstantAsync = createAsyncThunk(
    'constants/deleteConstant',
    async (id: string) => {
        await constantsApi.deleteConstant(id);
        return id;
    }
);

const constantsSlice = createSlice({
    name: 'constants',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConstantsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConstantsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.constants = action.payload;
            })
            .addCase(fetchConstantsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = handleApiError(action.error);
            })
            .addCase(createConstantAsync.fulfilled, (state, action) => {
                state.constants.push(action.payload);
            })
            .addCase(updateConstantAsync.fulfilled, (state, action) => {
                const index = state.constants.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.constants[index] = action.payload;
                }
            })
            .addCase(deleteConstantAsync.fulfilled, (state, action) => {
                state.constants = state.constants.filter(c => c.id !== action.payload);
            });
    },
});

export const { clearError } = constantsSlice.actions;
export default constantsSlice.reducer;