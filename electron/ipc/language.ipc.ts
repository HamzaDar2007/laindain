import { ipcMain } from 'electron';
import { getStore } from '../store/electron-store';

export function setupLanguageIpc() {
    const store = getStore();

    // Get current language
    ipcMain.handle('get-language', () => {
        return store.get('language', 'en');
    });

    // Set language
    ipcMain.handle('set-language', (_event, language: string) => {
        store.set('language', language);
        return;
    });
}
