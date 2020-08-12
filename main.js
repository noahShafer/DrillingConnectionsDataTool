// Dependencies
const { app, BrowserWindow } = require('electron');
const setupEvents = require('./installers/setupEvents')

// handles setupevents as quickly as possible
 if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
 }

// Module to control application life.
const {ipcMain} = require('electron');
var path = require('path');

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 1000,
        width: 1500
    });
    mainWindow.setMenu(null);

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});