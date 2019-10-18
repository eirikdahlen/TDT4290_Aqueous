/*eslint max-len: ["error", { "ignoreStrings": true }]*/

const electron = require('electron');
const { app } = electron;
const { getFileAndLaunch } = require('../launch/chooseFile');
const {
  createKeyboardMappingWindow,
  createXboxMappingWindow,
  createMockupWindow,
} = require('./windows');
const { getConnectedClient } = require('./../TCP/TCPClient');

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
      {
        label: 'Mockup window',
        click: async () => {
          createMockupWindow();
        },
      },
    ],
  },
  {
    label: 'ROV',
    submenu: [
      {
        label: 'Connect to TCP',
        click() {
          getConnectedClient();
        },
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
        label: 'Xbox Controller Mappings',
        click: async () => {
          createXboxMappingWindow();
        },
      },
      {
        label: 'Keyboard Mappings',
        click: async () => {
          createKeyboardMappingWindow();
        },
      },
    ],
  },
];

module.exports = { menuTemplate };
