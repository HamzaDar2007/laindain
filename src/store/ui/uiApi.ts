export const uiApi = {
    async getTheme(): Promise<'light' | 'dark'> {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    },

    async setTheme(theme: 'light' | 'dark'): Promise<void> {
        localStorage.setItem('theme', theme);
    },
};
