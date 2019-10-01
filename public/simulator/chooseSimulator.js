var { dialog } = require('electron');
const { launchSimulator } = require('./launchSimulator');
const { getConnectedClient } = require('./../TCP/TCPClient');

// Opens browing window for choosing file - when file is chosen, simulator is launched and tcp client is created
function getSimulatorFileAndLaunch() {
  dialog.showOpenDialog(
    {
      properties: ['openFile'],
      filters: [{ name: 'Simulators', extensions: ['bat'] }],
    },
    function(filename) {
      filename = filename.toString();
      if (!filename) {
        return;
      }
      console.log(`Launching ${filename}`);
      const startSimulatorCommand = `start ${filename} && exit`;
      launchSimulator(startSimulatorCommand);
      getConnectedClient();
    },
  );
}

module.exports = { getSimulatorFileAndLaunch };
