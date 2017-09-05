'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import db from '../renderer/datastore'
// require('electron-debug')({showDevTools: true, enabled: true})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.disableHardwareAcceleration()

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  let x = db.get('janela.x') ? db.get('janela.x') : 800
  let y = db.get('janela.y') ? db.get('janela.y') : 121

  mainWindow = new BrowserWindow({
    width: process.env.NODE_ENV === 'development' ? 600 : 250,
    height: 360,
    frame: false,
    minHeight: 330,
    transparent: true,
    resizable: process.env.NODE_ENV === 'development',
    maximizable: false,
    // useContentSize: true,
    fullscreen: false,
    fullscreenable: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      devTools: process.env.NODE_ENV === 'development'
    }
  })

  mainWindow.loadURL(winURL)
  mainWindow.setAlwaysOnTop(true)
  mainWindow.setPosition(x, y)
  mainWindow.setHasShadow(false)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setAlwaysOnTop(true)
  })

  mainWindow.on('move', () => {
    let pos = mainWindow.getPosition()
    db.set('janela.x', pos[0])
    db.set('janela.y', pos[1])
  })
}

app.on('ready', () => {
  createWindow()
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates()
  }
})

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('update-not-available')
})
autoUpdater.on('error', (ev, msg) => {
  mainWindow.webContents.send('error', ev, msg)
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
})

autoUpdater.on('download-progress', (ev, progress) => {
  mainWindow.webContents.send('download-progress', ev, progress)
})

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall()
})
