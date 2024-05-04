const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  save: (text) => ipcRenderer.send("save", text),
});
