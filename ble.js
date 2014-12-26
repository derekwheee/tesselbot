var tessel = require('tessel'),
    bleLib = require('ble-ble113a'),
    wifi   = require('wifi-cc3000'),
    ble    = bleLib.use(tessel.port['A']),
    network, password;

ble.on('ready', function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('Connected to ble113a.');

    ble.writeLocalValue(0, new Buffer('Welcome to Tessel'));

    ble.startAdvertising();
});


ble.on('connect', function() {
    console.log("We have a BLE connection to master.");
});

//Bluetooth event handling, primarily logging
ble.on('disconnect', function() {
    console.log('Disconnected from central device')
  // Start advertising again
  ble.startAdvertising();
});

ble.on('startAdvertising', function(){
    console.log('Started advertising as BLE peripheral device')
});

ble.on('stopAdvertising', function(){
    console.log('Stopped advertising')
});

ble.on('remoteWrite', function (connection, index, valueWritten) {
    if (index === 0) {
        network = valueWritten.toString();
    }

    if (index === 1) {
        password = valueWritten.toString();
    }
    connectToWifi();
});

wifi.on('connect', function(res) {
    console.log('Connected to wifi');
});

function connectToWifi () {
    if (network && password) {
        console.log('Connecting to wifi...');
        wifi.connect({ssid: network, password: password});
    } else {
        console.log('Waiting for network or password...');
    }
}
