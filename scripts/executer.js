var childProcess = require('child_process');
var EventEmitter = require('events').EventEmitter;
var shell = require('./shell.js');

var Executer = function () {
    this.child = null;
    EventEmitter.call(this);
};

Executer.prototype = Object.create(EventEmitter.prototype);

Executer.prototype.execute = function (command, args) {
    childProcess.execSync(shell.scripts.startAdb);

    var child = this.child = childProcess.spawn(command, args);

    child.stdout.on('data', function (data) {
        var buffer = new Buffer(data).toString();

        var split = buffer.trim().split(' ');

        var values = split.filter(function (value) {
            return value !== '';
        });

        //console.log(values);

        this.emit('data', values);
    }.bind(this));

    child.on('close', function (code) {
        console.log('Closed with status: ' + code);
    });
};

Executer.prototype.terminate = function () {

  this.child.on('exit', function () {
      childProcess.exec(shell.scripts.killScript);
  });

  this.child.kill();
};

module.exports = Executer;
