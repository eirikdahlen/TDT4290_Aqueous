const electron = require('electron');
const { app } = electron;
const { getFileAndLaunch } = require('../launch/chooseFile');

// Menu template for control window
let menuTemplate = [
  {
    label: 'Simulator',
    submenu: [
      {
        label: 'Open file and run',
        click() {
          getFileAndLaunch();
        },
      },
    ],
  },
  {
    label: 'ROV',
    submenu: [
      {
        label: 'Connect to TCP',
      },
      {
        label: 'Start ROV serial port',
        click() {
          getFileAndLaunch(
            'C:/_work/FhSim/sfhdev/FhSimPlayPen_vs14_amd64/bin/aquaculturerobotics/runrtvisrunROV_ILOS_1.bat',
          );
        },
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
