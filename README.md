# androidmon

An application for monitoring android process cpu, memory and network usage created using Node.js, Github's Electron and Chart.js.

It also provides cpu, memory and network usage logging capability in csv format for easy import into Excel.

## Getting Started

Make sure Node.js, npm, bower are installed.

Get the dependencies:

    npm install
    bower install
    
Androidmon uses <a href="https://github.com/zulhilmizainuddin/nettomon#nettomon-">nettomon</a> for monitoring network usage. Refer <a href="https://github.com/zulhilmizainuddin/nettomon#android">here</a> for building and deploying nettomon into an Android device. **Note that the Android device must be rooted for the network monitoring to work.**
    
## How to use

Start the application by running androidmon.bat or run the following command at the root folder:

    npm start
    
1. Once the application has started, enter the process name to be monitored into the textbox. 
2. Click the 'Start monitor' button to start the monitoring session. 
3. Check the 'Enable log' button to start logging. Logs will be available under the 'log' directory.
4. End the monitoring session by clicking the 'Stop monitor' button or by closing the application.

## Screenshots

**CPU chart:**<br>
<img src="https://github.com/zulhilmizainuddin/androidmon/blob/master/screenshots/cpu-screenshot.png" width="80%" height="auto">

**Memory chart:**<br>
<img src="https://github.com/zulhilmizainuddin/androidmon/blob/master/screenshots/memory-screenshot.png" width="80%" height="auto">

**Network chart:**<br>
<img src="https://github.com/zulhilmizainuddin/androidmon/blob/master/screenshots/network-screenshot.png" width="80%" height="auto">
