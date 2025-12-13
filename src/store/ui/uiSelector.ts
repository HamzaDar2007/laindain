import { RootState } from '../index';

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectModalOpen = (state: RootState) => state.ui.modalOpen;
export const selectModalContent = (state: RootState) => state.ui.modalContent;
