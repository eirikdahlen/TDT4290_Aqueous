/**
 * This file is used as a work-around for using ipcRenderer in GamepadWrapper.
 * The original work-around worked for running the program, but the tests would fail
 */
window.ipcRenderer = require('electron').ipcRenderer;
window.remote = require('electron').remote;
