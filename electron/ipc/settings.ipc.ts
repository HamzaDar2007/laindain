import { ipcMain, app, BrowserWindow } from 'electron';
import { getStore } from '../store/electron-store';

export function setupIpcHandlers() {
    const store = getStore();

    // Get setting
    ipcMain.handle('get-setting', (_event, key: string) => {
        return store.get(key);
    });

    // Set setting
    ipcMain.handle('set-setting', (_event, key: string, value: any) => {
        store.set(key, value);
        return;
    });

    // Window controls
    ipcMain.on('minimize-window', (event) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        window?.minimize();
    });

    ipcMain.on('maximize-window', (event) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (window?.isMaximized()) {
            window.unmaximize();
        } else {
            window?.maximize();
        }
    });

    ipcMain.on('close-window', (event) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        window?.close();
    });

    // App version
    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });
}
