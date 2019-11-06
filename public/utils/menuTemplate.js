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
        label: 'IMC-ROV Mockup',
        click: async () => {
          createMockupWindow();
          ipcCommunicationTCPServer();
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
        label: 'Start ROV Serial Port',
        click() {
          getFileAndLaunch(global.settings.serialFile);
        },
      },
      {
        label: 'Settings',
        click() {
          const { x, y } = electron.screen.getCursorScreenPoint();
          createSettingsWindow(x, y);
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
        label: 'Gamepad Controls',
        click: async () => {
          createXboxMappingWindow();
        },
      },
      {
        label: 'Keyboard Controls',
        click: async () => {
          createKeyboardMappingWindow();
        },
      },
    ],
  },
];

module.exports = { menuTemplate };
