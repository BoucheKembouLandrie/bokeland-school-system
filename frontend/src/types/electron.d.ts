export { };

declare global {
    interface Window {
        electronAPI: {
            checkForUpdates: () => void;
            onUpdateAvailable: (callback: (event: any, info: any) => void) => void;
            onUpdateDownloaded: (callback: (event: any, info: any) => void) => void;
        };
    }
}
