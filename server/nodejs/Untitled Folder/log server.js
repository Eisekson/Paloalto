var PORT = 514;
var HOST = '120.110.114.33';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var fs = require('fs');

server.on('message', function (message, remote) {

    var str = message.toString() + '\n';




    fs.appendFile('../log.txt', str, function (err) {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            console.log(str);
        }
    });

});

server.bind(PORT, HOST);
