import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { getStore } from './store/electron-store';

export function createAppWindow(): BrowserWindow {
    const store = getStore();

    // Get saved window bounds or use defaults
    const windowBounds = store.get('windowBounds', {
        width: 1400,
        height: 900,
    });

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    // Center the window
    const x = Math.floor((screenWidth - windowBounds.width) / 2);
    const y = Math.floor((screenHeight - windowBounds.height) / 2);

    const mainWindow = new BrowserWindow({
        ...windowBounds,
        x,
        y,
        minWidth: 1024,
        minHeight: 768,
        backgroundColor: '#ffffff',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
        title: 'Financial System',
        icon: path.join(__dirname, '../resources/icon.png'),
        show: false, // Don't show until ready
    });

    // Show window when ready to prevent flickering
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Save window bounds on resize/move
    const saveBounds = () => {
        if (!mainWindow.isMaximized() && !mainWindow.isMinimized()) {
            store.set('windowBounds', mainWindow.getBounds());
        }
    };

    mainWindow.on('resize', saveBounds);
    mainWindow.on('move', saveBounds);

    return mainWindow;
}
