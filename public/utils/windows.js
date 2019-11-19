const electron = require('electron');
const { BrowserWindow, app } = electron;
const isDev = require('electron-is-dev');
const path = require('path');

let widthControlWindow;
let heightControlWindow;
let widthVideoWindow;
let heightVideoWindow;

let xControlWindow;
let yControlWindow;
let xVideoWindow;
let yVideoWindow;

let controlWindow;
let videoWindow;

let hasExternal = false;

const pathLogo = '../../assets/icons/logo.png';

// Function for creating the two windows - controls and video
function createWindows() {
  // Creates the two windows with positioning, width and height fitting the screen
  videoWindow = new BrowserWindow({
    title: 'Video feed',
    width: widthVideoWindow,
    height: heightVideoWindow,
    x: xVideoWindow,
    y: yVideoWindow,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, pathLogo),
  });

  //Adds a search parameter to the url to be loaded - this is then handled in the index.js/ViewManager.js, which finds the correct .js-file to load.
  videoWindow.loadURL(
    isDev
      ? 'http://localhost:3000?videoWindow'
      : `file://${path.join(__dirname, '../../build/index.html?videoWindow')}`,
  );

  controlWindow = new BrowserWindow({
    title: 'Controls',
    width: widthControlWindow,
    height: heightControlWindow,
    x: xControlWindow,
    y: yControlWindow,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, pathLogo),
  });

  controlWindow.loadURL(
    isDev
      ? 'http://localhost:3000?controlWindow'
      : `file://${path.join(
          __dirname,
          '../../build/index.html?controlWindow',
        )}`,
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

  if (hasExternal) {
    videoWindow.maximize();
    controlWindow.maximize();
  }

  return [videoWindow, controlWindow];
}

// Sets the width and height of screen - for positioning the created windows according to screen size
function setWidthAndHeight() {
  const { screen } = electron;
  // Get the primary screen, as well as a complete list of all available screens
  const mainDisplay = screen.getPrimaryDisplay();
  const allDisplays = screen.getAllDisplays();

  // Find which screen is the external one
  let externalDisplay = allDisplays.find(display => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });

  // Set the widths of the window to half the width of the screen
  heightVideoWindow = heightControlWindow = mainDisplay.bounds.height;
  widthVideoWindow = widthControlWindow = mainDisplay.bounds.width / 2;

  // If an external screen is detected:
  if (externalDisplay) {
    // Position the windows on their respective screens
    xVideoWindow = mainDisplay.bounds.x;
    yVideoWindow = mainDisplay.bounds.y;
    xControlWindow = externalDisplay.bounds.x;
    yControlWindow = externalDisplay.bounds.y;

    hasExternal = true;

    // If an external screen is *not* detected:
  } else {
    // Position the video window to the left and the control window to the right
    xVideoWindow = mainDisplay.bounds.x;
    yVideoWindow = yControlWindow = mainDisplay.bounds.y;
    xControlWindow = mainDisplay.bounds.width - mainDisplay.bounds.width / 2;
  }
}

// Handle add item window
function createXboxMappingWindow() {
  let xboxMappingWindow = new BrowserWindow({
    title: 'Xbox Controller Mappings',
    icon: path.join(__dirname, pathLogo),
  });
  xboxMappingWindow.loadURL(
    `file://${path.join(__dirname, '../img/xbox-mappings.png')}`,
  );
  // Handle garbage collection
  xboxMappingWindow.on('close', function() {
    xboxMappingWindow = null;
  });

  xboxMappingWindow.setMenu(null);
}

function createMockupWindow() {
  let mockupWindow = new BrowserWindow({
    title: 'Mockup',
    width: widthControlWindow,
    height: heightControlWindow,
    x: xControlWindow,
    y: yControlWindow,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, pathLogo),
  });

  mockupWindow.loadURL(
    isDev
      ? 'http://localhost:3000?mockupWindow'
      : `file://${path.join(__dirname, '../../build/index.html?mockupWindow')}`,
  );
  if (isDev) {
    mockupWindow.webContents.openDevTools();
  }

  // Handle garbage collection
  mockupWindow.on('close', function() {
    mockupWindow = null;
  });

  mockupWindow.setMenu(null);
  global.mockupWindow = mockupWindow;
}

// Handle add item window
function createKeyboardMappingWindow() {
  let keyboardMappingWindow = new BrowserWindow({
    title: 'Keyboard Mappings',
    icon: path.join(__dirname, pathLogo),
  });
  keyboardMappingWindow.loadURL(
    `file://${path.join(__dirname, '../img/keyboard-mappings.png')}`,
  );
  // Handle garbage collection
  keyboardMappingWindow.on('close', function() {
    keyboardMappingWindow = null;
  });

  keyboardMappingWindow.setMenu(null);
}

function createSettingsWindow() {
  let settingsWindow = new BrowserWindow({
    title: 'Settings',
    modal: true,
    frame: false,
    parent: controlWindow,
    x: xControlWindow + 10,
    y: yControlWindow + 50,
    width: 380,
    height: 560,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    transparent: true,
  });
  settingsWindow.setMenu(null);

  settingsWindow.on('close', function() {
    settingsWindow = null;
  });

  settingsWindow.loadURL(
    isDev
      ? 'http://localhost:3000?settingsWindow'
      : `file://${path.join(
          __dirname,
          '../../build/index.html?settingsWindow',
        )}`,
  );
  global.settingsWindow = settingsWindow;
}

module.exports = {
  createWindows,
  setWidthAndHeight,
  createXboxMappingWindow,
  createKeyboardMappingWindow,
  createMockupWindow,
  createSettingsWindow,
};
