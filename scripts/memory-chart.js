"use strict";

const moment = require('moment');
const fs = require('fs');
const LineChart = require('./line-chart.js');
const Logger = require('./logger.js');
require('./string.js');

const MemoryChart = function (ctx, info) {
    this.info = info;

    this.scale = [
        Math.pow(10, 0),
        Math.pow(10, 1) / 5,
        Math.pow(10, 2) / 5,
        Math.pow(10, 3) / 5,
        Math.pow(10, 4) / 5,
        Math.pow(10, 5) / 5,
        Math.pow(10, 6) / 5,
        Math.pow(10, 7) / 5
    ];

    this.currentScaleStepWidth = this.scale[0];

    LineChart.call(this, ctx);
};

MemoryChart.prototype = Object.create(LineChart.prototype);

MemoryChart.prototype.init = function () {

    this.info.pss.text('-');
    this.info.privateDirty.text('-');
    this.info.privateClean.text('-');

    LineChart.prototype.init.call(this, [{
        label: "PSS",
        fillColor: "rgba(217, 83, 79, 0.1)",
        strokeColor: "rgba(217, 83, 79, 1)"
    }, {
        label: 'Private dirty',
        fillColor: "rgba(92, 184, 92, 0.1)",
        strokeColor: "rgba(92, 184, 92, 1)"
    }, {
        label: 'Private clean',
        fillColor: "rgba(51, 122, 183, 0.1)",
        strokeColor: "rgba(51, 122, 183, 1)"
    }]);
};

MemoryChart.prototype.rescale = function (values) {

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

MemoryChart.prototype.start = function (processName) {

    fs.readFile('scripts/memory-script.sh', {encoding: 'utf-8'}, (err, data) => {
        if (!err) {
            const memoryScript = data.replace('%s', processName).removeAllNewlines();

            const command = {
                cmd: 'adb',
                args: ['shell', memoryScript]
            };

            LineChart.prototype.start.call(this, command, (values, data) => {
                //console.log(values);

                const pss = parseInt(values[0], 10);
                const privateDirty = parseInt(values[1], 10);
                const privateClean = parseInt(values[2], 10);

                LineChart.prototype.prepareData.call(this, [
                        pss,
                        privateDirty,
                        privateClean
                    ],
                    data);

                this.rescale(data);

                if (this.logger !== null) {
                    this.logger.log(this.logFile, {
                        columnNames: [
                            'PSS',
                            'Private dirty',
                            'Private clean'
                        ],
                        values: [
                            pss,
                            privateDirty,
                            privateClean
                        ]
                    });
                }

                this.info.pss.text(pss + " KB");
                this.info.privateDirty.text(privateDirty + ' KB');
                this.info.privateClean.text(privateClean + ' KB');
            });
        }
    });
};

MemoryChart.prototype.kill = function () {
    LineChart.prototype.kill.call(this);
};

MemoryChart.prototype.log = function () {
    this.logFile = moment().format('YYYYMMDD_HHmmss') + '_memory';
    this.logger = new Logger();
};

MemoryChart.prototype.legend = function () {
    return LineChart.prototype.legend.call(this);
};

module.exports = MemoryChart;
