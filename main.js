"use strict";

const app = require('app');
const BrowserWindow = require('browser-window');
const fs = require('fs');
require('./scripts/string.js');

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    process.env.Path += `;${__dirname}\\adb`;

    mainWindow = new BrowserWindow({
        width: 800,
        height: 520,
        resizable: false,
        fullscreen: false,
        autoHideMenuBar: true
    });

    /*mainWindow.setMenu(null);*/
    /*mainWindow.openDevTools();*/

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});