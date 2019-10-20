const { dialog } = require('electron');

function getFileAndSend() {
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
      global.settingsWindow.webContents.send('file-chosen', filename);
    },
  );
}
module.exports = { getFileAndSend };
