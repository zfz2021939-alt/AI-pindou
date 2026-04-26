const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('aipindou', {
  providers: {
    list: () => ipcRenderer.invoke('providers:list'),
    save: (provider) => ipcRenderer.invoke('providers:save', provider),
    remove: (id) => ipcRenderer.invoke('providers:remove', id)
  },
  ai: {
    optimizeImage: (payload) => ipcRenderer.invoke('ai:optimize-image', payload)
  }
})
