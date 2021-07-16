const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    frame: false,
    backgroundColor: "#ffffff",
    titleBarStyle: "hiddenInset",
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
      // devTools: false,
    },
  });
  win.setMenuBarVisibility(false);
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "screens/explicit.html"),
      protocol: "file:",
      slashes: true,
    })
  );
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
