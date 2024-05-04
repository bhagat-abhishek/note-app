const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const fs = require("fs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Listening to IPC
  ipcMain.on("save", async (event, text) => {
    // Save the text to a file
    let fullpath = await dialog.showSaveDialog(win, {
      defaultPath: "filename.txt",
    });

    if (!fullpath.canceled) {
      fs.writeFile(fullpath.filePath, text, (err) => {
        if (err) console.log("There was an error saving the file.", err);
        console.log("File has been saved.");
      });
    }
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
