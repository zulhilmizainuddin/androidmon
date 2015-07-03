# android-process-monitor

An application for monitoring android process cpu and memory usage created using Node.js, Github's Electron and Chart.js.

It also provides cpu and memory usage logging capability in csv format for easy import into Excel.

## Getting Started

Make sure Node.js, npm, bower and adb is installed. 

Add adb to the environment path to allow the application to communicate with an android device through adb.

Get the dependencies:

    npm install
    bower install
    
## How to use

Start the application by running:

    npm start
    
1. Once the application has started, enter the process name to be monitored into the textbox. 
2. Click the 'Start monitor' button to start the monitoring session. 
3. Check the 'Enable log' button to start logging. Logs will be available under the 'log' directory.
4. End the monitoring session by clicking the 'Stop monitor' button or by closing the application.

## Screenshots

Cpu chart:<br>
<img src="https://github.com/wiseguy343gs/android-process-monitor/blob/master/screenshots/cpu-screenshot.png" width="640px" height="480px">

Memory chart:<br>
<img src="https://github.com/wiseguy343gs/android-process-monitor/blob/master/screenshots/memory-screenshot.png" width="640px" height="480px">
