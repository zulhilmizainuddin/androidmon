"use strict";

const Executer = require('./executer.js');

const LineChart = function (ctx) {
    this.ctx = ctx;
    this.lineChart = null;
    this.logFile = '';
    this.logger = null;

    this.executer = new Executer();

    this.legendTemplate =   "<ul class=\"list-inline\" style=\"float: left; margin-left: 0px\">" +
                                "<% for (var i=0; i<datasets.length; i++){%>" +
                                    "<li>" +
                                        "<mark style=\"background-color: <%=datasets[i].strokeColor%>;color: white\">" +
                                            "<%if(datasets[i].label){%><%=datasets[i].label%><%}%>" +
                                        "</mark>" +
                                    "</li>" +
                                "<%}%>" +
                            "</ul>";

    this.options = {
        animation: false,
        scaleOverride: true,
        scaleSteps: 10,
        scaleStepWidth: 10,
        scaleStartValue: 0,
        pointDot: false,
        legendTemplate: this.legendTemplate
    };

    this.data = {
        labels: new Array(60).fill(0).map((value, index) => { return 60 - index; })
    };
};

LineChart.prototype.instantiateChart = function () {
    this.lineChart = new Chart(this.ctx).Line(this.data, this.options);
};

LineChart.prototype.prepareData = function (usage, data) {
    for (let i = 0; i < data.length; i++) {
        data[i].shift();
        data[i].push(usage[i]);

        //console.log(data[i]);
    }
};

LineChart.prototype.init = function (datasets) {

    for (let i = 0; i < datasets.length; i++) {
        datasets[i].data = new Array(60).fill(0);
    }

    this.data.datasets = datasets;

    this.instantiateChart();
};

LineChart.prototype.rescale = function (scaleStepWidth) {
    this.lineChart.destroy();
    this.lineChart = null;

    this.options.scaleStepWidth = scaleStepWidth;

    this.instantiateChart();
};

LineChart.prototype.start = function (command, processOutput) {

    const array = [];
    for (let i = 0; i < this.data.datasets.length; i++) {
        array[i] = [];
        for (let j = 0; j < 60; j++) {
            array[i][j] = 0;
        }
    }

    this.executer.on('data', (values) => {

        processOutput(values, array);

        for (let i = 0; i < this.data.datasets.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                this.lineChart.datasets[i].points[j].value = array[i][j];
            }
        }

        this.lineChart.update();
    });

    this.executer.execute(command.cmd, command.args);
};

LineChart.prototype.kill = function () {
    this.executer.terminate();
};

LineChart.prototype.legend = function () {
    return this.lineChart.generateLegend();
};

module.exports = LineChart;
