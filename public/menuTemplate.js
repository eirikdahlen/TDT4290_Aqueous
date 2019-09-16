// Menu template for control window
let menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Choose simulator file"
      }
    ]
  },
  {
    label: "Run",
    submenu: [
      {
        label: "Start"
      },
      {
        label: "Connect TCP"
      },
      {
        label: "Serialize"
      }
    ]
  },
  {
    label: "Exit",
    click() {
      app.quit();
    }
  },
  {
    label: "DevTools",
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools();
    }
  }
];

module.exports = { menuTemplate };
