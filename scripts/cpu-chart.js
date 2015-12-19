var sprintf = require('sprintf-js').sprintf;
var moment = require('moment');
var fs = require('fs');
var LineChart = require('./line-chart.js');
var Logger = require('./logger.js');

var CpuChart = function (ctx, info) {
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

    var cpuScript = fs.readFileSync('scripts/cpu-script.sh', 'utf8');
    cpuScript = sprintf(cpuScript, processName).replace(/\r?\n|\r/g, "");

    var command = {
        cmd: 'adb',
        args: ['shell', cpuScript]
    };

    LineChart.prototype.start.call(this, command, function (values, data) {
        //console.log(values);

        if (values[0] === 'ok') {
            var cpuUtilization = parseInt(values[1].replace('%', ''), 10);
            var processPid = parseInt(values[2], 10);
            var threadCount = parseInt(values[3], 10);

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
        }

        this.info.cpuUtilization.text(
            !isNaN(cpuUtilization) ? cpuUtilization + '%' : '-'
        );
        this.info.processPid.text(
            !isNaN(processPid) ? processPid : '-'
        );
        this.info.threadCount.text(
            !isNaN(threadCount) ? threadCount : '-'
        );
    }.bind(this));
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
