const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let controlWindow;
let videoWindow;

function createWindows() {
  videoWindow = new BrowserWindow({
    name: "Video feed",
    width: 400,
    height: 300
  });
  videoWindow.loadURL(
    isDev
      ? "http://localhost:3000?videoWindow"
      : `file://${path.join(__dirname, "../build/index.html?videoWindow")}`
  );
  controlWindow = new BrowserWindow({
    name: "Controls",
    width: 400,
    height: 300
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
}

app.on("ready", createWindows);

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
