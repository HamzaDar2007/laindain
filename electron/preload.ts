import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Settings
    getSetting: (key: string) => ipcRenderer.invoke('get-setting', key),
    setSetting: (key: string, value: any) => ipcRenderer.invoke('set-setting', key, value),

    // Language
    getLanguage: () => ipcRenderer.invoke('get-language'),
    setLanguage: (language: string) => ipcRenderer.invoke('set-language', language),

    // Window controls
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),

    // App info
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});

// Type definitions for TypeScript
export interface ElectronAPI {
    getSetting: (key: string) => Promise<any>;
    setSetting: (key: string, value: any) => Promise<void>;
    getLanguage: () => Promise<string>;
    setLanguage: (language: string) => Promise<void>;
    minimizeWindow: () => void;
    maximizeWindow: () => void;
    closeWindow: () => void;
    getAppVersion: () => Promise<string>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
