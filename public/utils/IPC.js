// Handles interprocess communications:
// view -> main
// main -> view
const { ipcMain } = require('electron');
const { handleClick, setUpOrDown } = require('./../controls/mapping');

// Function for setting up listeners between the main process (electron.js) and the renderer process (Components etc.)
function setIPCListeners() {
  ipcMain.on('button-click', (event, { button, value }) => {
    handleClick({ button, value });
  });
  ipcMain.on('button-up-down', (event, { button, down }) => {
    setUpOrDown({ button, down });
  });
}

//Sends messages to the two renderers/browser windows
function sendMessage(msg) {
  const { videoWindow, controlWindow } = global;
  try {
    videoWindow.webContents.send(msg);
    controlWindow.webContents.send(msg);
  } catch (error) {
    console.log('Windows are closed');
  }
}

module.exports = { setIPCListeners, sendMessage };
