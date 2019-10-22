const { dialog } = require('electron');
const { runCommand } = require('./launchFile');
const { getConnectedClient } = require('./../TCP/TCPClient');

// Opens browing window for choosing file - when file is chosen, simulator is launched and tcp client is created
function getFileAndLaunch(file) {
  if (file) {
    const startSimulatorCommand = `start ${file} && exit`;
    console.log(`Launching ${file}`);
    runCommand(startSimulatorCommand);
    return;
  }
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
      runCommand(startSimulatorCommand);
      getConnectedClient();
    },
  );
}

module.exports = { getFileAndLaunch };
