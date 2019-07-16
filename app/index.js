var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;
var ipc = electron.ipcMain;

app.on('ready', function() {
    var appWindow, infoWindow;
    appWindow = new BrowserWindow({
        show: false
    });
    appWindow.loadURL('file://' + __dirname + '/index.html');
    infoWindow = new BrowserWindow({
        width: 400,
        height: 300,
        show: false
    });
    infoWindow.loadURL('file://' + __dirname + '/info.html');

    appWindow.once('ready-to-show', function () {
        appWindow.show();
        setTimeout(function() {
            infoWindow.show();
        }, 1000)
    });

    ipc.on('closeInfoWindow', function(event) {
        event.returnValue = '';
        infoWindow.hide();
    });
});