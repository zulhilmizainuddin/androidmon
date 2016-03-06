"use strict";

const CpuChart = require('./scripts/cpu-chart.js');
const MemoryChart = require('./scripts/memory-chart.js');
const NetworkChart = require('./scripts/network-chart.js');
const Logger = require('./scripts/logger.js');

$(document).ready(() => {

    initializeChartTabs();

    const cpuChart = initializeCpuChart();
    const memoryChart = initializeMemoryChart();
    const networkChart = initializeNetworkChart();

    initializeMonitoring(cpuChart, memoryChart, networkChart);
    initializeLogger(cpuChart, memoryChart, networkChart);
});

function initializeChartTabs() {
    const cpuDiv = $('#cpu');
    const memoryDiv = $('#memory');
    const networkDiv = $('#network');

    cpuDiv.css({'visibility': 'visible'});
    memoryDiv.css({'visibility': 'hidden'});
    networkDiv.css({'visibility': 'hidden'});

    $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
        switch ($(e.target).attr('href')) {
            case '#cpu':
                cpuDiv.appendTo('#tabContent');
                memoryDiv.appendTo('#tabContent');
                networkDiv.appendTo('#tabContent');

                cpuDiv.css({'visibility': 'visible'});
                memoryDiv.css({'visibility': 'hidden'});
                networkDiv.css({'visibility': 'hidden'});
                break;
            case '#memory':
                memoryDiv.appendTo('#tabContent');
                cpuDiv.appendTo('#tabContent');
                networkDiv.appendTo('#tabContent');

                cpuDiv.css({'visibility': 'hidden'});
                memoryDiv.css({'visibility': 'visible'});
                networkDiv.css({'visibility': 'hidden'});
                break;
            case '#network':
                networkDiv.appendTo('#tabContent');
                memoryDiv.appendTo('#tabContent');
                cpuDiv.appendTo('#tabContent');

                cpuDiv.css({'visibility': 'hidden'});
                memoryDiv.css({'visibility': 'hidden'});
                networkDiv.css({'visibility': 'visible'});
                break;
        }
    });
}

function initializeCpuChart() {
    const cpuCtx = $('#cpuChart').get(0).getContext('2d');

    const cpuUtilization = $('#cpuUtilization');
    const processPid = $('#processPid');
    const threadCount = $('#threadCount');

    const cpuChart = new CpuChart(cpuCtx, {
        cpuUtilization: cpuUtilization,
        processPid: processPid,
        threadCount: threadCount
    });
    cpuChart.init();
    $('#cpuLegend').append(cpuChart.legend());

    return cpuChart;
}

function initializeMemoryChart() {
    const memoryCtx = $('#memoryChart').get(0).getContext('2d');

    const pss = $('#pss');
    const privateDirty = $('#privateDirty');
    const privateClean = $('#privateClean');

    const memoryChart = new MemoryChart(memoryCtx, {
        pss: pss,
        privateDirty: privateDirty,
        privateClean: privateClean
    });
    memoryChart.init();
    $('#memoryLegend').append(memoryChart.legend());

    return memoryChart;
}

function initializeNetworkChart() {
    const networkCtx = $('#networkChart').get(0).getContext('2d');

    const download = $('#download');
    const upload = $('#upload');

    const networkChart = new NetworkChart(networkCtx, {
        download: download,
        upload: upload
    });
    networkChart.init();
    $('#networkLegend').append(networkChart.legend());

    return networkChart;
}

function initializeMonitoring(cpuChart, memoryChart, networkChart) {
    const processName = $('#processName');
    const startMonitor = $('#startMonitor');
    const stopMonitor = $('#stopMonitor');

    stopMonitor.prop('disabled', true);

    startMonitor.click(() => {
        processName.prop('disabled', true);
        startMonitor.prop('disabled', true);
        stopMonitor.prop('disabled', false);

        cpuChart.start(processName.val().trim());
        memoryChart.start(processName.val().trim());
        networkChart.start(processName.val().trim());
    });

    stopMonitor.click(() => {
        processName.prop('disabled', false);
        startMonitor.prop('disabled', false);
        stopMonitor.prop('disabled', true);

        cpuChart.kill();
        memoryChart.kill();
        networkChart.kill();
    });
}

function initializeLogger(cpuChart, memoryChart, networkChart) {
    const enableLog = $('#enableLog');

    enableLog.change(() => {
        if (enableLog.is(':checked')) {
            Logger.enableLog = true;
            cpuChart.log();
            memoryChart.log();
            networkChart.log();
        }
        else {
            Logger.enableLog = false;
        }
    });
}