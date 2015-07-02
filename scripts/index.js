$(document).ready(function () {
    var CpuChart = require('./scripts/cpu-chart.js');
    var MemoryChart = require('./scripts/memory-chart.js');
    var Logger = require('./scripts/logger.js');

    var chromeTabsShell = $('.chrome-tabs-shell');
    chromeTabs.init({
        $shell: chromeTabsShell,
        minWidth: 45,
        maxWidth: 160
    });

    chromeTabsShell.bind('chromeTabRender', function () {
        var currentTab = chromeTabsShell.find('.chrome-tab-current');

        var cpuDiv = $('#cpu');
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

    var cpuCtx = $('#cpuChart').get(0).getContext('2d');

    var cpuUtilization = $('#cpuUtilization');
    var processPid = $('#processPid');
    var threadCount = $('#threadCount');

    var cpuChart = new CpuChart(cpuCtx, {
        cpuUtilization: cpuUtilization,
        processPid: processPid,
        threadCount: threadCount
    });
    cpuChart.init();
    $('#cpuLegend').append(cpuChart.legend());

    var memoryCtx = $('#memoryChart').get(0).getContext('2d');

    var pss = $('#pss');
    var privateDirty = $('#privateDirty');
    var privateClean = $('#privateClean');

    var memoryChart = new MemoryChart(memoryCtx, {
        pss: pss,
        privateDirty: privateDirty,
        privateClean: privateClean
    });
    memoryChart.init();
    $('#memoryLegend').append(memoryChart.legend());

    var processName = $('#processName');
    var startMonitor = $('#startMonitor');
    var stopMonitor = $('#stopMonitor');
    var enableLog = $('#enableLog');

    stopMonitor.prop('disabled', true);

    startMonitor.click(function () {
        processName.prop('disabled', true);
        startMonitor.prop('disabled', true);
        stopMonitor.prop('disabled', false);

        cpuChart.start(processName.val().trim());
        memoryChart.start(processName.val().trim());
    });

    stopMonitor.click(function () {
        processName.prop('disabled', false);
        startMonitor.prop('disabled', false);
        stopMonitor.prop('disabled', true);

        cpuChart.kill();
        memoryChart.kill();
    });

    enableLog.change(function () {
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
