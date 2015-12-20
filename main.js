var app = require('app');
var BrowserWindow = require('browser-window');
var childProcess = require('child_process');
var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;
require('./scripts/string.js');

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    process.env.Path += sprintf(';%s\\adb', __dirname);

    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    //mainWindow.openDevTools();
    mainWindow.on('closed', function () {
        var killScript = fs.readFileSync('scripts/kill-script.sh', 'utf8');
        killScript = sprintf('adb shell "%s"', killScript).removeAllNewlines();

        childProcess.exec(killScript);
        mainWindow = null;
    });
});