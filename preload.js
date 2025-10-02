const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (defaultPath) => ipcRenderer.invoke('save-file', defaultPath),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  
  // File system operations
  openFileLocation: (filePath) => ipcRenderer.invoke('open-file-location', filePath),
  openFileExternal: (filePath) => ipcRenderer.invoke('open-file-external', filePath),
  
  // Dialog operations
  showError: (title, message) => ipcRenderer.invoke('show-error', title, message),
  showInfo: (title, message) => ipcRenderer.invoke('show-info', title, message),
  
  // Menu events
  onMenuOpenFile: (callback) => ipcRenderer.on('menu-open-file', callback),
  onMenuClearAll: (callback) => ipcRenderer.on('menu-clear-all', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
