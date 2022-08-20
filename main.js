const net = require('net');
const gen = require('./gen');

class Connection extends net.Socket {
    constructor(ip, port) {
        super();
        this.setTimeout(750);
        this._recved = '';

        this.addListener('error', this.destroy);
        this.addListener('timeout', this.destroy);
        this.addListener('data', data => this._recved += data);

        this.connect(port, ip);
    }

    send(data) {
        this._recved = '';
        this.write(data);
    }

    recv() {
        return this._recved;
    }

    destroy(e) {
        super.destroy(e);
    }
}

function task() {
    let conn;
    setInterval(function() {
        if (conn) return;

        conn = new Connection(gen(), 80);

        conn.addListener('connect', function() {
            conn.send(`GET / HTTP/1.1\r\nHost: ${conn.remoteAddress}\r\n\r\n`);
        });

        conn.addListener('close', function() {
            let data = conn.recv();
            let ip = conn.remoteAddress;

            conn = null;

            if (!data) return;

            let m = data.match(/<title>([^<]+)/);
            if (!m) return;

            let title = m[1].replace(/(\r|\n)/, ' ').trim();

            console.log(`${ip}: ${title}`);
        });
    });
};

Promise.all(Array(1024).fill().map(() => new Promise(task)));
