"use strict";

const moment = require('moment');
const fs = require('fs');
const LineChart = require('./line-chart.js');
const Logger = require('./logger.js');
require('./string.js');

const NetworkChart = function (ctx, info) {
    this.info = info;

    this.scale = [
        Math.pow(10, 0),
        Math.pow(10, 1),
        Math.pow(10, 2),
        Math.pow(10, 3),
        Math.pow(10, 4),
        Math.pow(10, 5),
        Math.pow(10, 6),
        Math.pow(10, 7)
    ];

    this.currentScaleStepWidth = this.scale[0];

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

NetworkChart.prototype.rescale = function (values) {

    const maxArray = [];
    for (let i = 0; i < values.length; i++) {
        maxArray[i] = Math.max.apply(null, values[i]);
    }

    const max = Math.max.apply(null, maxArray);

    if (max === 0 || Math.floor(max / this.currentScaleStepWidth) === 1) {
        return;
    }

    let scaleStepWidth = 0;
    for (let i = 0; i < this.scale.length; i++) {
        if (max < this.scale[i]) {
            scaleStepWidth = this.currentScaleStepWidth = this.scale[i - 1];
            break;
        }
    }

    LineChart.prototype.rescale.call(this, scaleStepWidth);
};

NetworkChart.prototype.start = function (processName) {

    fs.readFile('scripts/network-script.sh', {encoding: 'utf-8'}, (err, data) => {
        if (!err) {
            const networkScript = data.replace('%s', processName).removeAllNewlines();

            console.log(networkScript);

            const command = {
                cmd: 'adb',
                args: ['shell', networkScript]
            };

            LineChart.prototype.start.call(this, command, (values, data) => {
                /*console.log(values);*/

                const upload =
                    !isNaN(parseInt(values[1], 10)) ? parseInt(values[1], 10) : 0;
                const download =
                    !isNaN(parseInt(values[4], 10)) ? parseInt(values[4], 10) : 0;

                LineChart.prototype.prepareData.call(this, [
                        upload,
                        download
                    ],
                    data);

                this.rescale(data);

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