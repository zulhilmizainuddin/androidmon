"use strict";

const childProcess = require('child_process');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const sprintf = require('sprintf-js').sprintf;
require('./string.js');

const Executer = function () {
    this.child = null;
    EventEmitter.call(this);
};

Executer.prototype = Object.create(EventEmitter.prototype);

Executer.prototype.execute = function (command, args) {
    let startAdbScript = fs.readFileSync('scripts/start-adb-script.sh', 'utf8');
    startAdbScript = sprintf('adb shell "%s"', startAdbScript).removeAllNewlines();

    childProcess.execSync(startAdbScript);

    const child = this.child = childProcess.spawn(command, args);

    child.stdout.on('data', (data) => {
        const buffer = new Buffer(data).toString();

        /*console.log(data);*/

        if (buffer !== '\r\r\n') {
            const split = buffer.trim().split(' ');

            const values = split.filter((value) => {
                return value !== '';
            });

            /*console.log(values);*/

            this.emit('data', values);
        }
    });

    child.on('close', (code) => {
        console.log('Closed with status: ' + code);
    });
};

Executer.prototype.terminate = function () {

  this.child.on('exit', () => {
      let killScript = fs.readFileSync('scripts/kill-script.sh', 'utf8');
      killScript = sprintf('adb shell "%s"', killScript).removeAllNewlines();

      childProcess.exec(killScript);
  });

  this.child.kill();
};

module.exports = Executer;
