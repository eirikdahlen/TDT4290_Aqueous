// electron.js is the main process for electron. It handles windows and communication between windows.

const electron = require('electron');
const localShortcut = require('electron-localshortcut');
const { app, BrowserWindow, Menu, ipcMain } = electron;

const path = require('path');
const isDev = require('electron-is-dev');

const { menuTemplate } = require('./menuTemplate');

const { setIPCListeners } = require('./IPC');

let controlWindow;
let videoWindow;

let widthControlWindow;
let heightControlWindow;
let widthVideoWindow;
let heightVideoWindow;

let xControlWindow;
let yControlWindow;
let xVideoWindow;
let yVideoWindow;

//Function for creating the two windows - controls and video
function createWindows() {
  // Creates the two windows with positioning, width and height fitting the screen
  videoWindow = new BrowserWindow({
    title: 'Video feed',
    width: widthVideoWindow,
    height: heightVideoWindow,
    x: xVideoWindow,
    y: yVideoWindow,
    webPreferences: {
      nodeIntegration: true,
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
    width: widthControlWindow,
    height: heightControlWindow,
    x: xControlWindow,
    y: yControlWindow,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  controlWindow.loadURL(
    isDev
      ? 'http://localhost:3000?controlWindow'
      : `file://${path.join(__dirname, '../build/index.html?controlWindow')}`,
  );

  // Function for closing the entire application when only closing one window
  function closeApp() {
    // Dereferences the windows when the app is closed, to save resources.
    controlWindow = null;
    videoWindow = null;

    // Quits the app
    app.quit();
  }

  // Unregister all local keyboard shorcuts on the video window
  videoWindow.on('close', () => {
    localShortcut.unregisterAll(videoWindow);
  });

  // Close all windows when closing one of then
  controlWindow.on('closed', closeApp);
  videoWindow.on('closed', closeApp);

  videoWindow.setMenu(null);
}

// Sets the width and height of screen - for positioning the created windows according to screen size
function setWidthAndHeight() {
  // Get the primary screen, as well as a complete list of all available screens
  const mainDisplay = electron.screen.getPrimaryDisplay();
  const allDisplays = electron.screen.getAllDisplays();

  // Find which screen is the external one
  let externalDisplay = allDisplays.find(display => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });

  // If an external screen is detected:
  if (externalDisplay) {
    // Set the size if the video window to the full size of the main screen
    heightVideoWindow = mainDisplay.bounds.height;
    widthVideoWindow = mainDisplay.bounds.width;

    // Set the size of the control window to the full size of the external screen
    heightControlWindow = externalDisplay.bounds.height;
    widthControlWindow = externalDisplay.bounds.width;

    // Position the windows on their respective screens
    xVideoWindow = mainDisplay.bounds.x;
    yVideoWindow = mainDisplay.bounds.y;
    xControlWindow = externalDisplay.bounds.x;
    yControlWindow = externalDisplay.bounds.y;

    // If an external screen is *not* detected:
  } else {
    // Set the widths of the window to half the width of the screen
    heightVideoWindow = heightControlWindow = mainDisplay.bounds.height;
    widthVideoWindow = widthControlWindow = mainDisplay.bounds.width / 2;

    // Position the video window to the left and the control window to the right
    xVideoWindow = mainDisplay.bounds.x;
    yVideoWindow = yControlWindow = mainDisplay.bounds.y;
    xControlWindow = mainDisplay.bounds.width - mainDisplay.bounds.width / 2;
  }
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

  // Register a local shortcut that enables toggling of dev tools in the video window
  localShortcut.register(videoWindow, 'CmdOrCtrl+D', () => {
    videoWindow.webContents.toggleDevTools();
  });
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
