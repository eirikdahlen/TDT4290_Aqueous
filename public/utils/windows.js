const electron = require('electron');
const { app } = electron;
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

// Function for creating the two windows - controls and video
function createWindows() {
  // Creates the two windows with positioning, width and height fitting the screen
  let videoWindow = new electron.BrowserWindow({
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
  });

  //Adds a search parameter to the url to be loaded - this is then handled in the index.js/ViewManager.js, which finds the correct .js-file to load.
  videoWindow.loadURL(
    isDev
      ? 'http://localhost:3000?videoWindow'
      : `file://${path.join(__dirname, '../../build/index.html?videoWindow')}`,
  );

  let controlWindow = new electron.BrowserWindow({
    title: 'Controls',
    width: widthControlWindow,
    height: heightControlWindow,
    x: xControlWindow,
    y: yControlWindow,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
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

  return [videoWindow, controlWindow];
}

// Sets the width and height of screen - for positioning the created windows according to screen size
function setWidthAndHeight() {
  const screen = electron.screen;

  // Get the primary screen, as well as a complete list of all available screens
  const mainDisplay = screen.getPrimaryDisplay();
  const allDisplays = screen.getAllDisplays();

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

// Handle add item window
function createXboxMappingWindow() {
  let xboxMappingWindow = new electron.BrowserWindow({
    title: 'Xbox Controller Mappings',
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
  let mockupWindow = new electron.BrowserWindow({
    title: 'Mockup',
  });

  mockupWindow.loadURL(
    `file://${path.join(__dirname, '../../build/index.html?mockupWindow')}`,
  );
  // Handle garbage collection
  mockupWindow.on('close', function() {
    mockupWindow = null;
  });

  mockupWindow.setMenu(null);
}

// Handle add item window
function createKeyboardMappingWindow() {
  let keyboardMappingWindow = new electron.BrowserWindow({
    title: 'Keyboard Mappings',
  });
  keyboardMappingWindow.loadURL(
    `file://${path.join(__dirname, '../img/keyboard-mappings.jpg')}`,
  );
  // Handle garbage collection
  keyboardMappingWindow.on('close', function() {
    keyboardMappingWindow = null;
  });

  keyboardMappingWindow.setMenu(null);
}

module.exports = {
  createWindows,
  setWidthAndHeight,
  createXboxMappingWindow,
  createKeyboardMappingWindow,
  createMockupWindow,
};
