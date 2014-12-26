var noble = require('noble'),
    transService = ['d752c5fb13804cd5b0efcac7d72cff20'],
    charServices = ['883f1e6b76f64da187eb6bdbdb617888', '21819AB0C9374188B0DBB9621E1696CD', '57b09eaea3694677bf6e92a95baa3a38', '6696f92ef3c04d8584dd798b0ceff2e9', '488b04483aaf44c690ecc85fd5d9f616', 'e101b160a59b4f2497df6821337b45b2', '7834933b3f6d44b3b38e8b67a7ed6702', 'b08e1773fbb6428d9e4cd6322f7bf5fe', 'c98e8fd35be743e0b35a951f1a07c25c', '977840be8d5c4805a3292f9ddc8db3a3', 'bb2ed7989d0b41a6a75331b16f93281e', '4a0efa07e1814a7fbd72094df3e97132'],
    tessel;

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {

    if (peripheral.advertisement.localName === 'Tessel') {
        tessel = peripheral;
        tessel.connect(discoverService);
    }

});

function discoverService (err) {

    if (err) {
        console.log('Error: ', err);
        return false;
    }

    tessel.discoverServices(['d752c5fb13804cd5b0efcac7d72cff20'], discoverCharacteristics)

}

function discoverCharacteristics (err, services) {

    if (err) {
        console.log('Error: ', err);
        return false;
    }

    var service = services[0];

    service.discoverCharacteristics(charServices, configureWifi)
}

function configureWifi(err, characteristics) {

    if (err) {
        console.log('Error: ', err);
        return false;
    }

    var networkChar  = characteristics[0],
        passwordChar = characteristics[1];

    networkChar.write(new Buffer('NETWORKSSID'), false, function () {
        if (err) console.log('Something\'s gone wrong.');
    });

    passwordChar.write(new Buffer('NETWORKPASS'), false, function () {
        if (err) console.log('Something\'s gone wrong.');
    });

}
