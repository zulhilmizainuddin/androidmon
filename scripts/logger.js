var fs = require('fs');

var Logger = function () {
    this.columnNameWritten = false;
};

Logger.enableLog = false;

Logger.prototype.log = function (fileName, data) {
    if (Logger.enableLog) {
        var directory = __dirname + '/../log';
        var input = '';

        fs.mkdir(directory, function (err) {
            if (!this.columnNameWritten) {
                input = data.columnNames.join(',') + '\n';
            }

            input += data.values.join(',') + '\n';

            fs.appendFile(directory + '/' + fileName + '.log', input, function (err) {
               if (!err) {
                   this.columnNameWritten = true;
               }
            }.bind(this));
        }.bind(this));
    }
};

module.exports = Logger;