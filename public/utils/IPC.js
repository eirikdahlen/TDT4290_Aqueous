// Handles interprocess communications:
// view -> main
// main -> view
// view -> main -> view
const { ipcMain } = require('electron');
const { handleClick, setUpOrDown } = require('./../controls/mapping');

// Function for setting up listeners between the main process (electron.js) and the renderer process (Components etc.)
function setIPCListeners() {
  //For testing purposes: The client should in reality be created right after the simulator is opened
  //client = getConnectedClient();
  ipcMain.on('button-click', (event, { button, value }) => {
    handleClick({ button, value });
  });
  ipcMain.on('button-up-down', (event, { button, down }) => {
    setUpOrDown({ button, down });
  });
}

//Sends data to the two renderers/browser windows
function sendReceivedMessage() {
  const { videoWindow, controlWindow } = global;
  try {
    videoWindow.webContents.send('data-received');
    controlWindow.webContents.send('data-received');
  } catch (error) {
    console.log('Windows are closed');
  }
}

//Sends data to the two renderers/browser windows
function sendSentMessage() {
  const { videoWindow, controlWindow } = global;
  try {
    videoWindow.webContents.send('data-sent');
    controlWindow.webContents.send('data-sent');
  } catch (error) {
    console.log('Windows are closed');
  }
}

module.exports = { setIPCListeners, sendReceivedMessage, sendSentMessage };
