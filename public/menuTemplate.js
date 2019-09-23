const electron = require('electron');
const { app } = electron;
const { getSimulatorFile } = require('./simulator/chooseSimulator');

// Menu template for control window
let menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Choose simulator file',
        click() {
          getSimulatorFile();
        },
      },
    ],
  },
  {
    label: 'Run',
    submenu: [
      {
        label: 'Start',
        accelerator: 'CmdOrCtrl+R',
        click() {
          getSimulatorFile();
        },
      },
      {
        label: 'Connect TCP',
      },
      {
        label: 'Serialize',
      },
    ],
  },
  {
    label: 'Exit',
    accelerator: 'CmdOrCtrl+Q',
    click() {
      app.quit();
    },
  },
  {
    label: 'DevTools',
    accelerator: 'CmdOrCtrl+D',
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools();
    },
  },
];

module.exports = { menuTemplate };
