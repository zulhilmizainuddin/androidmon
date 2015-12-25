"use strict";

const app = require('app');
const BrowserWindow = require('browser-window');
const childProcess = require('child_process');
const fs = require('fs');
const sprintf = require('sprintf-js').sprintf;
require('./scripts/string.js');

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    process.env.Path += sprintf(';%s\\adb', __dirname);

    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    //mainWindow.openDevTools();
    mainWindow.on('closed', () => {
        let killScript = fs.readFileSync('scripts/kill-script.sh', 'utf8');
        killScript = sprintf('adb shell "%s"', killScript).removeAllNewlines();

        childProcess.exec(killScript);
        mainWindow = null;
    });
});