export interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    modalOpen: boolean;
    modalContent: string | null;
}
