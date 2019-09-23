// Handles interprocess communications:
// view -> main
// main -> view
// view -> main -> view
const { getConnectedClient } = require('./TCP/TCPClient');
const { ipcMain } = require('electron');
const { handleClick, setUpOrDown } = require('./xbox/clickHandler');

let client;

// Function for setting up listeners between the main process (electron.js) and the renderer process (Components etc.)
function setIPCListeners() {
  //For testing purposes: The client should in reality be created right after the simulator is opened
  //client = getConnectedClient();
  ipcMain.on('xbox-change', (event, { button, value }) => {
    handleClick({ button, value });
  });
  ipcMain.on('xbox-up-down', (event, { button, down }) => {
    setUpOrDown({ button, down });
  });
}

module.exports = { setIPCListeners };
