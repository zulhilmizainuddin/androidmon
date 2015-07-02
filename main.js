var app = require('app');
var BrowserWindow = require('browser-window');
var childProcess = require('child_process');
var shell = require('./scripts/shell.js');

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    //mainWindow.openDevTools();
    mainWindow.on('closed', function () {
        childProcess.exec(shell.scripts.killScript);
        mainWindow = null;
    });
});