const net = require('net');
const gen = require('./gen');

class Connection extends net.Socket {
    constructor(ip, port) {
        super();

        this.on('data', data => this.recved += data);

        this.on('timeout', close);
        this.on('error', close);
        this.on('close', function() {
            if (this.recved)
                console.log(this.recved);
        });

        function close() {
            this.destroy();
        }

        this.setTimeout(750);
        this.connect(port, ip);
    }

    send(data) {
        this.recved = '';
        this.write(data);
    }
}

function task() {
    let conn;
    setInterval(function() {
        if (!conn) {
            let conn = new Connection(gen(), 80);
            conn.on('connect', function() {
                conn.send(`GET / HTTP/1.1\r\nHost: ${conn.address().address}\r\n\r\n`);
            });
            conn.on('close', () => conn = null);
        }
    });
};

Promise.all(Array(1024).fill().map(() => new Promise(task)));
