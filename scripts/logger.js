"use strict";

const fs = require('fs');

const Logger = function () {
    this.columnNameWritten = false;
};

Logger.enableLog = false;

Logger.prototype.log = function (fileName, data) {
    if (Logger.enableLog) {
        const directory = __dirname + '/../log';
        let input = '';

        fs.mkdir(directory, (err) => {
            if (!this.columnNameWritten) {
                input = data.columnNames.join(',') + '\n';
            }

            input += data.values.join(',') + '\n';

            fs.appendFile(directory + '/' + fileName + '.log', input, (err) => {
               if (!err) {
                   this.columnNameWritten = true;
               }
            });
        });
    }
};

module.exports = Logger;