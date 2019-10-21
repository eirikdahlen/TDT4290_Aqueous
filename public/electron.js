const setupEvents = require('../installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}
// electron.js is the main process for electron. It handles windows and communication between windows.
const electron = require('electron');
const { app, Menu } = electron;

const isDev = require('electron-is-dev');

const { menuTemplate } = require('./utils/menuTemplate');
// const { registerHotkeys, unregisterHotkeysOnClose } = require('./hotkeys');
const { createWindows, setWidthAndHeight } = require('./utils/windows');

const { setIPCListeners } = require('./utils/IPC');
const { closeSimulator } = require('./launch/closeSimulator');

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
global.fromROV = {
  north: 0.0,
  east: 0.0,
  down: 0.0,
  roll: 0.0,
  pitch: 0.0,
  yaw: 0.0,
};
global.bias = {
  surge: 0.0,
  sway: 0.0,
  heave: 0.0,
};

/**
 * Global mode variable
 * 0 - Manual
 * 1 - DP mode
 * 2 - NF mode
 */
global.mode = {
  globalMode: 0,
  nfAvailable: true,
};

/**
 * In IMC, positive and negative values of velocity is also indicating port/starboard direction
 * Positive velocity values: Starboard / styrbord
 * Negative velocity values: Port / babord
 * Direction property is therefore not needed
 */
global.netfollowing = {
  distance: 0,
  velocity: 0,
  degree: 0,
};

/**
 * Add correct settings later
 * Placeholders for X, Y, Z for now
 */
global.dynamicpositioning = {
  Xsetting1: 0,
  Ysetting2: 0,
  Zsetting3: 0,
};

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
    //videoWindow.webContents.openDevTools(); Must be off for transparancy
  }

  // Close all windows when closing one of then
  controlWindow.on('closed', quitAll);
  videoWindow.on('closed', quitAll);
});

// Function for quitting the entire application also the simulator
function quitAll() {
  closeSimulator('FhRtVis.exe');
  // Dereferences the windows when the app is closed, to save resources.
  controlWindow = null;
  videoWindow = null;

  // Quits the app
  app.quit();
}

// Boilerplate code - probably just quits the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quitAll();
  }
});

// Boilerplate code - probably just opens windows when app is launched
app.on('activate', () => {
  if (controlWindow === null) {
    createWindows();
  }
});
