"use strict";

const moment = require('moment');
const fs = require('fs');
const LineChart = require('./line-chart.js');
const Logger = require('./logger.js');
require('./string.js');

const CpuChart = function (ctx, info) {
    this.info = info;

    LineChart.call(this, ctx);
};

CpuChart.prototype = Object.create(LineChart.prototype);

CpuChart.prototype.init = function () {

    this.info.cpuUtilization.text('-');
    this.info.processPid.text('-');
    this.info.threadCount.text('-');

    LineChart.prototype.init.call(this, [{
        label: 'Utilization',
        fillColor: "rgba(51, 122, 183, 0.1)",
        strokeColor: "rgba(51, 122, 183, 1)"
    }]);
};

CpuChart.prototype.start = function (processName) {

    fs.readFile('scripts/cpu-script.sh', {encoding: 'utf-8'}, (err, data) => {
        if (!err) {
            const cpuScript = data.replace('%s', processName).removeAllNewlines();

            const command = {
                cmd: 'adb',
                args: ['shell', cpuScript]
            };

            LineChart.prototype.start.call(this, command, (values, data) => {
                //console.log(values);

                const cpuUtilization = parseInt(values[0].replace('%', ''), 10);
                const processPid = parseInt(values[1], 10);
                const threadCount = parseInt(values[2], 10);

                LineChart.prototype.prepareData.call(this, [
                        cpuUtilization
                    ],
                    data);

                if (this.logger !== null) {
                    this.logger.log(this.logFile, {
                        columnNames: [
                            'Utilization',
                            'PID',
                            'Threads'
                        ],
                        values: [
                            cpuUtilization,
                            processPid,
                            threadCount
                        ]
                    });
                }

        this.info.cpuUtilization.text(cpuUtilization + '%');
        this.info.processPid.text(processPid);
        this.info.threadCount.text(threadCount);
            });
        }
    });
};

CpuChart.prototype.kill = function () {
    LineChart.prototype.kill.call(this);
};

CpuChart.prototype.log = function () {
    this.logFile = moment().format('YYYYMMDD_HHmmss') + '_cpu';
    this.logger = new Logger();
};

CpuChart.prototype.legend = function () {
    return LineChart.prototype.legend.call(this);
};

module.exports = CpuChart;
