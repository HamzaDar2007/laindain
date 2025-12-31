export interface ElectronAPI {
    getLanguage(): Promise<string>;
    setLanguage(language: string): Promise<void>;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}

export { };
