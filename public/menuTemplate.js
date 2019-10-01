const electron = require('electron');
const { app } = electron;
const { getSimulatorFileAndLaunch } = require('./simulator/chooseSimulator');

// Menu template for control window
let menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Choose simulator file',
        click() {
          getSimulatorFileAndLaunch();
        },
      },
    ],
  },
  {
    label: 'Run',
    submenu: [
      {
        label: 'Start',
        click() {
          getSimulatorFileAndLaunch();
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
    click() {
      app.quit();
    },
  },
  {
    label: 'DevTools',
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools();
    },
  },
];

module.exports = { menuTemplate };
