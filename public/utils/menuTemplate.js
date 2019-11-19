/*eslint max-len: ["error", { "ignoreStrings": true }]*/

const electron = require('electron');
const { app } = electron;
const { ipcCommunicationTCPServer } = require('../TCP/TCPServerMockUp');
const { getFileAndLaunch } = require('../launch/chooseFile');
const {
  createKeyboardMappingWindow,
  createXboxMappingWindow,
  createMockupWindow,
  createSettingsWindow,
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
            {
              label: 'Settings',
              accelerator: 'CmdOrCtrl+,',
              click() {
                createSettingsWindow();
              },
            },
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
    label: 'File',
    submenu: [
      {
        label: 'Run file...',
        accelerator: 'CmdOrCtrl+O',
        click() {
          getFileAndLaunch();
        },
      },
      ...(process.platform === 'darwin'
        ? []
        : [
            {
              label: 'Settings',
              accelerator: 'CmdOrCtrl+,',
              click() {
                createSettingsWindow();
              },
            },
          ]),
    ],
  },
  {
    label: 'ROV',
    submenu: [
      {
        label: 'Connect to TCP',
        accelerator: 'CmdOrCtrl+T',
        click() {
          getConnectedClient();
        },
      },
      // This button really doesn't do anything?
      /* {
        label: 'Start ROV Serial Port',
        accelerator: 'CmdOrCtrl+C',
        click() {
          getFileAndLaunch(global.settings.serialFile);
        },
      }, */
    ],
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      {
        label: 'Show IMC-ROV Mockup',
        accelerator: 'CmdOrCtrl+M',
        click: async () => {
          createMockupWindow();
          ipcCommunicationTCPServer();
        },
      },
      { type: 'separator' },
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
    label: 'Controls',
    submenu: [
      {
        label: 'Show Gamepad Controls',
        accelerator: 'CmdOrCtrl+G',
        click: async () => {
          createXboxMappingWindow();
        },
      },
      {
        label: 'Show Keyboard Controls',
        accelerator: 'CmdOrCtrl+K',
        click: async () => {
          createKeyboardMappingWindow();
        },
      },
    ],
  },
];

module.exports = { menuTemplate };
