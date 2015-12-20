var sprintf = require('sprintf-js').sprintf;
var moment = require('moment');
var fs = require('fs');
var LineChart = require('./line-chart.js');
var Logger = require('./logger.js');

var MemoryChart = function (ctx, info) {
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

    var maxArray = [];
    for (var i = 0; i < values.length; i++) {
        maxArray[i] = Math.max.apply(null, values[i]);
    }

    var max = Math.max.apply(null, maxArray);

    if (max === 0 || Math.floor(max / this.currentScaleStepWidth) === 1) {
        return;
    }

    var scaleStepWidth = 0;
    for (var i = 0; i < this.scale.length; i++) {
        if (max < this.scale[i]) {
            scaleStepWidth = this.currentScaleStepWidth = this.scale[i - 1];
            break;
        }
    }

    LineChart.prototype.rescale.call(this, scaleStepWidth);
};

MemoryChart.prototype.start = function (processName) {

    var memoryScript = fs.readFileSync('scripts/memory-script.sh', 'utf8');
    memoryScript = sprintf(memoryScript, processName).replace(/\r?\n|\r/g, "");

    var command = {
        cmd: 'adb',
        args: ['shell', memoryScript]
    };

    LineChart.prototype.start.call(this, command, function (values, data) {
        //console.log(values);

        if (values[0] === 'ok') {
            var pss = parseInt(values[1], 10);
            var privateDirty = parseInt(values[2], 10);
            var privateClean = parseInt(values[3], 10);

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
        }
    }.bind(this));
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
