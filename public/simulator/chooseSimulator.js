var { dialog } = require("electron");
const { launchSimulator } = require("./launchSimulator");

function getSimulatorFile() {
  dialog.showOpenDialog(
    {
      properties: ["openFile"],
      // Only possible to choose .bat-files
      filters: [{ name: "Simulators", extensions: ["bat"] }]
    },
    function(filename) {
      // Store filename somewhere, so we can use it for launching simulator later
      let fileName = filename.toString();
      console.log("Filename: ");
      console.log(fileName);

      // Command to run file
      const startSimulator =
      "start " + fileName +" && exit";

      launchSimulator(startSimulator);

    }
  );
}
  
module.exports = { getSimulatorFile };
