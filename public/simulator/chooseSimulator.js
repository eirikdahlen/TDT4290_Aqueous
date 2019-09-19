var { dialog } = require("electron");

function getSimulatorFile() {
  dialog.showOpenDialog(
    {
      properties: ["openFile"],
      // Only possible to choose .bat-files
      filters: [{ name: "Simulators", extensions: ["bat"] }]
    },
    function(filename) {
      // Store filename somewhere, so we can use it for launching simulator later
      console.log(filename.toString());
    }
  );
}

module.exports = { getSimulatorFile };
