const gen = require('./gen');
const Connection = require('./connection');

function getTitle(html) {
    if (!html) return;

    let m = html.match(/<title>([^<]+)/);
    if (!m) return;

    return m[1].replace(/(\r|\n)/, ' ').trim();
}

function sendRequest() {
    this.send(`GET / HTTP/1.1\r\nHost: ${this.remoteAddress}\r\n\r\n`);
    this.end();
}

function processResponse() {
    let data = this.recv();
    let ip = this.remoteAddress;

    let title = getTitle(data);

    if (title) console.log(`${ip}: ${title}`);
    this.end();
    this.destroy();
}

function task() {
    let conn;
    setInterval(function() {
        if (conn) return;

        conn = new Connection(gen(), 80);

        conn.addListener('ready', sendRequest);
        conn.addListener('end', processResponse);

        conn.addListener('close', () => conn = null)
    });
};

Promise.all(Array(1024).fill().map(() => new Promise(task)));
