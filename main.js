const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Listening to IPC
  ipcMain.on("save", (event, text) => {
    console.log(text);
  });

  // Removing the default menu on the window
  win.removeMenu();
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  // Openining the default window if OS == MAC | Specific to Linux
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Quiting the application if OS == Windows and all the windows are closed
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
});
