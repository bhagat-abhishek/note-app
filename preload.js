const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  save: (text) => ipcRenderer.send("save", text),
  saved: (callback) => ipcRenderer.on('saved', (_event, value) => callback(value)),
});
