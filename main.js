const gen = require('./gen');
const net = require('net');

function processHost(ip, port, cb) {
    const socket = new net.Socket();
    let recved = '';
    socket.check_result = false;

    socket.on('connect', function() {
        socket.check_result = true;
        socket.write(`GET / HTTP/1.1\r\nHost: ${ip}\r\n\r\n`);
    });

    socket.on('data', function(data) { recved += data; });

    socket.on('timeout', close);
    socket.on('error', close);
    socket.on('close', function() { cb(socket.check_result, port); });

    function close() {
        if (recved)
            console.log(recved);
        socket.destroy();
    }

    socket.setTimeout(750);
    socket.connect(port, ip);
}

let task = function(resolve, reject) {
    let ip;
    setInterval(function() {
        if (!ip) {
            ip = gen();
            processHost(ip, 80, function() { ip = null; });
        }
    });
};

const workers = Array(1024).fill().map(function() {
    return new Promise(task);
});

Promise.all(workers);
