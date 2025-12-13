import { Language } from './languageTypes';

export const languageApi = {
    async getLanguage(): Promise<Language> {
        if (window.electronAPI) {
            return await window.electronAPI.getLanguage() as Language;
        }
        return (localStorage.getItem('language') as Language) || 'en';
    },

    async setLanguage(language: Language): Promise<void> {
        if (window.electronAPI) {
            await window.electronAPI.setLanguage(language);
        }
        localStorage.setItem('language', language);
    },
};
