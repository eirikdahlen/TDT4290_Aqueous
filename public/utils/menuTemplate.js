/*eslint max-len: ["error", { "ignoreStrings": true }]*/

const electron = require('electron');
const { app } = electron;
const { getFileAndLaunch } = require('../launch/chooseFile');

let isMac = process.platform === 'darwin';

const menuTemplate = [
  // { role: 'appMenu' }
  ...(process.platform === 'darwin'
    ? [
        {
          label: app.getName(),
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  {
    label: 'Simulator',
    submenu: [
      {
        label: 'Open File and Run',
        accelerator: 'CmdOrCtrl+S',
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
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  // { role: 'editMenu' }
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org');
        },
      },
    ],
  },
];

module.exports = { menuTemplate };
