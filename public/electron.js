const setupEvents = require('../installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}
// electron.js is the main process for electron. It handles windows and communication between windows.
const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;

const path = require('path');
const isDev = require('electron-is-dev');

const { menuTemplate } = require('./utils/menuTemplate');

const { setIPCListeners } = require('./utils/IPC');

let controlWindow;
let videoWindow;

let width;
let height;

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
 * In IMC, positive and negative values of velocity is also indicating port/starboard direction
 * Positive velocity values: Starboard / styrbord
 * Negative velocity values: Port / babord
 * Direction property is therefore not needed
 */
global.netfollowing = {
  distance: 0,
  velocity: 0,
  degree: 0,
  active: false,
  available: true,
};

/**
 * Add correct settings later
 * Placeholders for now
 */
global.dynamicpositioning = {
  setting1: 0,
  setting2: 0,
  active: false,
};


//Function for creating the two windows - controls and video
function createWindows() {
  // Creates the two windows with positioning, width and height fitting the screen
  videoWindow = new BrowserWindow({
    title: 'Video feed',
    width: width / 2,
    height: height,
    x: 0,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'utils/preload.js'),
    },
  });
  //Adds a search parameter to the url to be loaded - this is then handled in the index.js/ViewManager.js, which finds the correct .js-file to load.
  videoWindow.loadURL(
    isDev
      ? 'http://localhost:3000?videoWindow'
      : `file://${path.join(__dirname, '../build/index.html?videoWindow')}`,
  );
  controlWindow = new BrowserWindow({
    title: 'Controls',
    width: width / 2,
    height: height,
    x: width - width / 2,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'utils/preload.js'),
    },
  });
  controlWindow.loadURL(
    isDev
      ? 'http://localhost:3000?controlWindow'
      : `file://${path.join(__dirname, '../build/index.html?controlWindow')}`,
  );
  //Deferences the windows when the app is closed, to save resources.
  controlWindow.on('closed', () => {
    app.quit();
  });
  videoWindow.on('closed', () => {
    app.quit();
  });

  videoWindow.setMenu(null);

  // Make the windows globally accessible
  global.videoWindow = videoWindow;
  global.controlWindow = controlWindow;
}

// Sets the width and height of screen - for positioning the created windows according to screen size
function setWidthAndHeight() {
  const display = electron.screen.getPrimaryDisplay();
  width = display.bounds.width;
  height = display.bounds.height;
}

// Functions that are run when the app is ready

app.on('ready', () => {
  // Sets menu for controlVindow (from public/menuTemplate.js) and removes menu from videoWindow
  const controlMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(controlMenu);
  setWidthAndHeight();
  createWindows();

  setIPCListeners();

  if (isDev) {
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    controlWindow.webContents.openDevTools();
    videoWindow.webContents.openDevTools();
  }
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
