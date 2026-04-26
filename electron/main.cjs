const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron')
const path = require('node:path')
const { optimizeImage } = require('./ai-provider.cjs')
const { readProviders, removeProvider, saveProvider } = require('./provider-store.cjs')

const isDev = process.argv.includes('--dev')
let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 720,
    title: 'AIpindou 拼豆图像转换器',
    backgroundColor: '#f4efe6',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  mainWindow.setMenuBarVisibility(false)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:3000')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
    return
  }

  mainWindow.loadFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    dialog.showErrorBox('AIpindou 启动失败', `页面加载失败：${errorCode} ${errorDescription}`)
  })
}

app.whenReady().then(() => {
  ipcMain.handle('providers:list', () => readProviders())
  ipcMain.handle('providers:save', (_event, provider) => saveProvider(provider))
  ipcMain.handle('providers:remove', (_event, id) => removeProvider(id))
  ipcMain.handle('ai:optimize-image', (_event, payload) => optimizeImage(payload))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
