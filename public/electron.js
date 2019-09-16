const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;

const path = require("path");
const isDev = require("electron-is-dev");

let controlWindow;
let videoWindow;

let width;
let height;

function createWindows() {
  videoWindow = new BrowserWindow({
    title: "Video feed",
    width: width / 2,
    height: height,
    x: 0,
    y: 0,
    webPreferences: {
      nodeIntegration: true
    }
  });
  videoWindow.loadURL(
    isDev
      ? "http://localhost:3000?videoWindow"
      : `file://${path.join(__dirname, "../build/index.html?videoWindow")}`
  );
  controlWindow = new BrowserWindow({
    title: "Controls",
    width: width / 2,
    height: height,
    x: width - width / 2,
    y: 0,
    webPreferences: {
      nodeIntegration: true
    }
  });
  controlWindow.loadURL(
    isDev
      ? "http://localhost:3000?controlWindow"
      : `file://${path.join(__dirname, "../build/index.html?controlWindow")}`
  );
  if (isDev) {
    // Open the DevTools.
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    controlWindow.webContents.openDevTools();
    videoWindow.webContents.openDevTools();
  }
  controlWindow.on("closed", () => (controlWindow = null));
  videoWindow.on("closed", () => (videoWindow = null));
}

// Finds width and height of screen - for positioning the windows
function setWidthAndHeight() {
  const display = electron.screen.getPrimaryDisplay();
  width = display.bounds.width;
  height = display.bounds.height;
}

app.on("ready", () => {
  setWidthAndHeight();
  createWindows();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (controlWindow === null) {
    createWindow();
  }
});
