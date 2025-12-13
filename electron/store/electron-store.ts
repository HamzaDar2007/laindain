import Store from 'electron-store';

interface StoreSchema {
    language: string;
    theme: string;
    windowBounds: {
        width: number;
        height: number;
        x?: number;
        y?: number;
    };
    apiBaseUrl: string;
    lastTenantId?: string;
    authToken?: string;
    refreshToken?: string;
}

let storeInstance: Store<StoreSchema> | null = null;

export function getStore(): Store<StoreSchema> {
    if (!storeInstance) {
        storeInstance = new Store<StoreSchema>({
            defaults: {
                language: 'en',
                theme: 'light',
                windowBounds: {
                    width: 1400,
                    height: 900,
                },
                apiBaseUrl: 'http://localhost:3000/api',
            },
        });
    }
    return storeInstance;
}
