const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'), // Ensure preload.js is correctly set up
        },
    });

    // Load the React app from the build folder
    win.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html')).catch(err => {
        console.error("Failed to load index.html:", err);
    });
}

// Initialize the app and create the window when ready
app.whenReady().then(() => {
    createWindow();

    // macOS: Re-create a window when the dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });


    // Start scheduler.js in the background
    const schedulerPath = path.join(__dirname, 'backend', 'scheduler.js');
    const schedulerProcess = fork(schedulerPath);

    // Listen for messages from scheduler.js
    schedulerProcess.on('message', (data) => {
        if (data && data.message) {
            // Send message to renderer process
            BrowserWindow.getAllWindows()[0].webContents.send('file-found', data.message);
        }
    });
});

// Close the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

