const electron = require("electron");
const { app } = electron;
const { getSimulatorFile } = require("./simulator/chooseSimulator");
const { launchSimulator } = require("./simulator/launchSimulator");


// Menu template for control window
let menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Choose simulator file",
        click() {
          getSimulatorFile();
        }
      }
    ]
  },
  {
    label: "Run",
    submenu: [
      {
        label: "Start",
        click() {
          // Filename of simulator
          const fileName = getSimulatorFile();
          
          // Command to run
          const startSimulator =
            "start" + fileName +" && exit";

          launchSimulator(startSimulator);
        }
      },
      {
        label: "Connect TCP"
      },
      {
        label: "Serialize"
      }
    ]
  },
  {
    label: "Exit",
    click() {
      app.quit();
    }
  },
  {
    label: "DevTools",
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools();
    }
  }
];

module.exports = { menuTemplate };
