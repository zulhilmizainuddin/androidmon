"use strict";

const moment = require('moment');
const fs = require('fs');
const LineChart = require('./line-chart.js');
const Logger = require('./logger.js');
require('./string.js');

const NetworkChart = function (ctx, info) {
    this.info = info;

    LineChart.call(this, ctx);
};

NetworkChart.prototype = Object.create(LineChart.prototype);

NetworkChart.prototype.init = function () {

    this.info.upload.text('-');
    this.info.download.text('-');

    LineChart.prototype.init.call(this, [{
        label: 'Upload',
        fillColor: "rgba(92, 184, 92, 0.1)",
        strokeColor: "rgba(92, 184, 92, 1)"
    }, {
        label: 'Download',
        fillColor: "rgba(51, 122, 183, 0.1)",
        strokeColor: "rgba(51, 122, 183, 1)"
    }]);
};

NetworkChart.prototype.start = function (processName) {

    fs.readFile('scripts/network-script.sh', {encoding: 'utf-8'}, (err, data) => {
        if (!err) {
            const networkScript = data.replace('%s', processName).removeAllNewlines();

            const command = {
                cmd: 'adb',
                args: ['shell', networkScript]
            };

            LineChart.prototype.start.call(this, command, (values, data) => {
                /*console.log(values);*/

                const upload =
                    !isNaN(parseInt(values[1], 10)) ? parseInt(values[1], 10) : 0;
                const download =
                    !isNaN(parseInt(values[5], 10)) ? parseInt(values[5], 10) : 0;

                LineChart.prototype.prepareData.call(this, [
                        upload,
                        download
                    ],
                    data);

                LineChart.prototype.rescale.call(this, data);

                if (this.logger !== null) {
                    this.logger.log(this.logFile, {
                        columnNames: [
                            'Upload',
                            'Download'
                        ],
                        values: [
                            upload,
                            download
                        ]
                    });
                }

                this.info.upload.text(upload + " KB");
                this.info.download.text(download + ' KB');
            });
        }
    });
};

NetworkChart.prototype.kill = function () {
    LineChart.prototype.kill.call(this);
};

NetworkChart.prototype.log = function () {
    this.logFile = moment().format('YYYYMMDD_HHmmss') + '_network';
    this.logger = new Logger();
};

NetworkChart.prototype.legend = function () {
    return LineChart.prototype.legend.call(this);
};

module.exports = NetworkChart;