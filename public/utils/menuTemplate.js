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
        label: 'Open Simulator',
        accelerator: 'CmdOrCtrl+S',
        click() {
          getFileAndLaunch();
        },
      },
      {
        label: 'IMC-ROV Mockup',
        accelerator: 'CmdOrCtrl+M',
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
        accelerator: 'CmdOrCtrl+T',
        click() {
          getConnectedClient();
        },
      },
      {
        label: 'Start ROV Serial Port',
        accelerator: 'CmdOrCtrl+C',
        click() {
          getFileAndLaunch(global.settings.serialFile);
        },
      },
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+I',
        click() {
          createSettingsWindow();
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
        accelerator: 'CmdOrCtrl+G',
        click: async () => {
          createXboxMappingWindow();
        },
      },
      {
        label: 'Keyboard Controls',
        accelerator: 'CmdOrCtrl+K',
        click: async () => {
          createKeyboardMappingWindow();
        },
      },
    ],
  },
];

module.exports = { menuTemplate };
