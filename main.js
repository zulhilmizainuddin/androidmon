"use strict";

const app = require('app');
const BrowserWindow = require('browser-window');
const childProcess = require('child_process');
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

    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    //mainWindow.openDevTools();

    mainWindow.on('closed', () => {
        fs.readFile('scripts/kill-script.sh', {encoding: 'utf-8'}, (err, data) => {
            if (!err) {
                const killScript = data.removeAllNewlines();

                childProcess.exec(`adb shell "${killScript}"`);
                mainWindow = null;
            }
        });
    });
});