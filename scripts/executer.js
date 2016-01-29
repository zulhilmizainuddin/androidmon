"use strict";

const childProcess = require('child_process');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
require('./string.js');

const Executer = function () {
    this.child = null;
    EventEmitter.call(this);
};

Executer.prototype = Object.create(EventEmitter.prototype);

Executer.prototype.execute = function (command, args) {

    fs.readFile('scripts/start-adb-script.sh', {encoding: 'utf-8'}, (err, data) => {
       if (!err) {
           const startAdbScript = data.removeAllNewlines();

           childProcess.execSync(`adb shell "${startAdbScript}"`);

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
       }
    });
};

Executer.prototype.terminate = function () {
    this.child.kill();
};

module.exports = Executer;
