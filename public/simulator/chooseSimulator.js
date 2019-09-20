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
      let fileName = filename.toString();
      console.log("Filename: ");
      console.log(fileName);

      return fileName;

    }
  );
}
  
module.exports = { getSimulatorFile };
