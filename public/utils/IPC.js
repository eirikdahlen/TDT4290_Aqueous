// Handles interprocess communications:
// view -> main
// main -> view
const { ipcMain } = require('electron');
const { handleClick, resetAllBias } = require('./../controls/mapping');
const { getFileAndSend } = require('./../launch/sendFile');

// Function for setting up listeners between the main process (electron.js) and the renderer process (Components etc.)
function setIPCListeners() {
  // Listen to click events
  ipcMain.on('button-click', (event, activeButtons) => {
    handleClick(activeButtons);
  });

  // Listen to reset bias requests
  ipcMain.on('reset-all-bias', () => {
    resetAllBias();
  });

  //Listen to function requests
  ipcMain.on('run-file-pick', () => {
    getFileAndSend();
  });

  // Listen to update settings
  ipcMain.on('settings-updated', () => {
    sendMessage('settings-updated', 'control');
  });
}

//Sends messages to the two renderers/browser windows
function sendMessage(msg, window) {
  const { videoWindow, controlWindow } = global;
  try {
    if (window === 'video') {
      videoWindow.webContents.send(msg);
    } else if (window === 'control') {
      controlWindow.webContents.send(msg);
    } else {
      videoWindow.webContents.send(msg);
      controlWindow.webContents.send(msg);
    }
  } catch (error) {
    console.log('Windows are closed');
    return false;
  }
}

module.exports = { setIPCListeners, sendMessage };
