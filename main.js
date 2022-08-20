const gen = require('./gen');
const Connection = require('./connection');

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
