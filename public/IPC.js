// Handles interprocess communications:
// view -> main
// main -> view
// view -> main -> view
const { getConnectedClient, sendData } = require("./TCP/TCPClient");

let client;

// Function for setting up listeners between the main process (electron.js) and the renderer process (Components etc.)
/* Example for receiving gamepad-inputs on the frontend and sending the data by TCP to the simulator:
In setIPCListeners:
ipcMain.on("key-clicked", function(event, tcp) {
  sendData(client, tcp);
});

In some component:
electron.ipcRenderer.send("key-clicked", tcp);
*/
function setIPCListeners() {
  /*
  //For testing purposes: The client should in reality be created right after the simulator is opened
  client = getConnectedClient();
  for (let i = 0; i < 10; i++) {
    sendData(client, `Test package ${i}`);
  }
  */
}

module.exports = { setIPCListeners };
