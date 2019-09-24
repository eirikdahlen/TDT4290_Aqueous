// Handles interprocess communications:
// view -> main
// main -> view
// view -> main -> view
const { getConnectedClient } = require('./TCP/TCPClient');

// Function for setting up listeners between the main process (electron.js) and the renderer process (Components etc.)
function setIPCListeners() {
  //For testing purposes: The client should in reality be created right after the simulator is opened
  getConnectedClient(); // TODO: Store client for future use?
}

module.exports = { setIPCListeners };
