const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    onFileFound: (callback) => ipcRenderer.on('file-found', (event, message) => callback(message)),
});
