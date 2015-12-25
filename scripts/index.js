"use strict";

$(document).ready(() => {
    const CpuChart = require('./scripts/cpu-chart.js');
    const MemoryChart = require('./scripts/memory-chart.js');
    const Logger = require('./scripts/logger.js');

    const chromeTabsShell = $('.chrome-tabs-shell');
    chromeTabs.init({
        $shell: chromeTabsShell,
        minWidth: 45,
        maxWidth: 160
    });

    chromeTabsShell.bind('chromeTabRender', () => {
        const currentTab = chromeTabsShell.find('.chrome-tab-current');

        const cpuDiv = $('#cpu');
        /*var memoryDiv = $('#memory');*/
        switch ($.trim(currentTab.text())) {
            case 'CPU':
                cpuDiv.show();
                /*memoryDiv.hide();*/
                document.getElementById('memory').style.visibility = 'hidden';
                break;
            case 'Memory':
                cpuDiv.hide();
                /*memoryDiv.show();*/
                document.getElementById('memory').style.visibility = 'visible';
                break;
        }
    });

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

    const processName = $('#processName');
    const startMonitor = $('#startMonitor');
    const stopMonitor = $('#stopMonitor');
    const enableLog = $('#enableLog');

    stopMonitor.prop('disabled', true);

    startMonitor.click(() => {
        processName.prop('disabled', true);
        startMonitor.prop('disabled', true);
        stopMonitor.prop('disabled', false);

        cpuChart.start(processName.val().trim());
        memoryChart.start(processName.val().trim());
    });

    stopMonitor.click(() => {
        processName.prop('disabled', false);
        startMonitor.prop('disabled', false);
        stopMonitor.prop('disabled', true);

        cpuChart.kill();
        memoryChart.kill();
    });

    enableLog.change(() => {
        if (enableLog.is(':checked')) {
            Logger.enableLog = true;
            cpuChart.log();
            memoryChart.log();
        }
        else {
            Logger.enableLog = false;
        }
    });
});
