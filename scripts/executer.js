var childProcess = require('child_process');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;
require('./string.js');

var Executer = function () {
    this.child = null;

    process.env.Path += sprintf(';%s\\..\\adb', __dirname);

    EventEmitter.call(this);
};

Executer.prototype = Object.create(EventEmitter.prototype);

Executer.prototype.execute = function (command, args) {
    var startAdbScript = fs.readFileSync('scripts/start-adb-script.sh', 'utf8');
    startAdbScript = sprintf('adb shell "%s"', startAdbScript).removeAllNewlines();

    childProcess.execSync(startAdbScript);

    var child = this.child = childProcess.spawn(command, args);

    child.stdout.on('data', function (data) {
        var buffer = new Buffer(data).toString();

        /*console.log(data);*/

        if (buffer !== '\r\r\n') {
            var split = buffer.trim().split(' ');

            var values = split.filter(function (value) {
                return value !== '';
            });

            /*console.log(values);*/

            this.emit('data', values);
        }
    }.bind(this));

    child.on('close', function (code) {
        console.log('Closed with status: ' + code);
    });
};

Executer.prototype.terminate = function () {

  this.child.on('exit', function () {
      var killScript = fs.readFileSync('scripts/kill-script.sh', 'utf8');
      killScript = sprintf('adb shell "%s"', killScript).removeAllNewlines();

      childProcess.exec(killScript);
  });

  this.child.kill();
};

module.exports = Executer;
