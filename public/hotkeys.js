const localShortcut = require('electron-localshortcut');
const { getSimulatorFile } = require('./simulator/chooseSimulator');

function registerHotkeys(app, videoWindow, controlWindow) {
  // Shortcut for toggling dev tools in the video window
  localShortcut.register(videoWindow, 'CmdOrCtrl+Alt+I', () => {
    videoWindow.webContents.toggleDevTools();
  });

  // Shortcut for toggling dev tools in the video window
  localShortcut.register(controlWindow, 'CmdOrCtrl+Alt+I', () => {
    controlWindow.webContents.toggleDevTools();
  });

  // Shortcut for running the simulator
  localShortcut.register('CmdOrCtrl+S', () => {
    getSimulatorFile();
  });

  // Shortcut for quitting the app
  localShortcut.register('CmdOrCtrl+Q', () => {
    app.quit();
  });
}

function unregisterHotkeysOnClose(videoWindow, controlWindow) {
  // Unregister all local keyboard shorcuts on the video window
  videoWindow.on('close', () => {
    if (videoWindow) {
      localShortcut.unregisterAll(videoWindow);
    }
  });

  // Unregister all local keyboard shorcuts on the control window
  controlWindow.on('close', () => {
    if (controlWindow) {
      localShortcut.unregisterAll(controlWindow);
    }
  });
}

module.exports = {
  registerHotkeys,
  unregisterHotkeysOnClose,
};
