const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const fs = require("fs");

let savedFilePath = undefined;

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

    // Checking if we have a saved file path
    if (savedFilePath === undefined) {
      let fullpath = await dialog.showSaveDialog(win, {
        defaultPath: "filename.txt",
      });

      // checking if the user cancled te dialog
      if (!fullpath.canceled) {
        // Updating the file path before saving
        savedFilePath = fullpath.filePath;
        // saving - writing data to a file
        writeToFile(savedFilePath, text, win);
      }
    } else {
      // saving - writing data to a file
      writeToFile(savedFilePath, text, win);
    }
  });

  // Removing the default menu on the window
  // win.removeMenu();
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

// Function to write file to a given path with the data
function writeToFile(path, data, window) {
  fs.writeFile(path, data, (err) => {
    if (err) console.log("Something went wrong saving the file.", err);
    window.webContents.send("saved", "success");
  });
}
