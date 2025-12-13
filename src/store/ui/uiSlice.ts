import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from './uiTypes';

const initialState: UIState = {
    sidebarOpen: true,
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    modalOpen: false,
    modalContent: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        openModal: (state, action: PayloadAction<string>) => {
            state.modalOpen = true;
            state.modalContent = action.payload;
        },
        closeModal: (state) => {
            state.modalOpen = false;
            state.modalContent = null;
        },
    },
});

export const { toggleSidebar, setSidebarOpen, setTheme, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
