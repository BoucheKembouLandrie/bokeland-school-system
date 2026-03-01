const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// KEEP THIS REFERENCE GLOBAL to prevent garbage collection
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: 'Leuana School',
        webPreferences: {
            nodeIntegration: false, // Security: Keep true only if absolutely necessary
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js') // We will create this next
        },
        icon: path.join(__dirname, 'build/icon.png') // Assumption
    });

    if (isDev) {
        // In Dev, we assume frontend is running on 5173 (Vite default)
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // In Prod, load static file
        mainWindow.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Check for updates once window is ready
    if (!isDev) {
        autoUpdater.checkForUpdatesAndNotify();
    }
}

// --- AUTO UPDATER EVENTS ---
autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://license.leuanaschool.com/updates/' // TO BE CONFIGURED with real domain or localhost proxy
});

autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Mise à jour disponible',
        message: `Version ${info.version} disponible. Téléchargement en cours...`
    });
});

autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox(mainWindow, {
        type: 'question',
        title: 'Mise à jour prête',
        message: 'La mise à jour a été téléchargée. Voulez-vous redémarrer maintenant pour l\'installer ?',
        buttons: ['Oui, redémarrer', 'Plus tard']
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});

autoUpdater.on('error', (err) => {
    console.error('Update error:', err);
    // Silent fail in production, or notify admin
});

// --- APP LIFECYCLE ---

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
