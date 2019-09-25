// electron.js is the main process for electron. It handles windows and communication between windows.

const electron = require('electron');
const { app, Menu } = electron;

const isDev = require('electron-is-dev');

const { menuTemplate } = require('./menuTemplate.js');
const { registerHotkeys, unregisterHotkeysOnClose } = require('./hotkeys');
const { createWindows, setWidthAndHeight } = require('./windows');

const { setIPCListeners } = require('./IPC');

let controlWindow;
let videoWindow;

// Global state objects
global.toROV = {
  surge: 0.0,
  sway: 0.0,
  heave: 0.0,
  roll: 0.0,
  pitch: 0.0,
  yaw: 0.0,
  autodepth: false,
  autoheading: false,
};
global.fromROV = {};

// Functions that are run when the app is ready
app.on('ready', () => {
  // Define the size of the windows, and create them
  setWidthAndHeight();
  [videoWindow, controlWindow] = createWindows();

  // Sets menu for controlVindow (from public/menuTemplate.js) and removes menu from videoWindow
  const controlMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(controlMenu);
  videoWindow.setMenu(null);

  setIPCListeners();

  if (isDev) {
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    controlWindow.webContents.openDevTools();
    videoWindow.webContents.openDevTools();
  }

  // Register hotkeys, as well as unregister them when the app closes
  registerHotkeys(app, videoWindow, controlWindow);
  unregisterHotkeysOnClose(videoWindow, controlWindow);

  // Function for closing the entire application when only closing one window
  function closeApp() {
    // Dereferences the windows when the app is closed, to save resources.
    controlWindow = null;
    videoWindow = null;

    // Quits the app
    app.quit();
  }

  // Close all windows when closing one of then
  controlWindow.on('closed', closeApp);
  videoWindow.on('closed', closeApp);
});

// Boilerplate code - probably just quits the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Boilerplate code - probably just opens windows when app is launched
app.on('activate', () => {
  if (controlWindow === null) {
    createWindows();
  }
});
