const gen = require('./gen');
const Connection = require('./connection');

function getTitle(html) {
    return html
        ?.match(/<title>([^<]+)/)
        ?.at(1)
        .replace(/(\r|\n)/, ' ')
        .trim();
}

function sendRequest() {
    this.send(`GET / HTTP/1.1\r\nHost: ${this.remoteAddress}\r\n\r\n`);
    this.end();
}

function processResponse() {
    const data = this.recv();
    const ip = this.remoteAddress;
    const title = getTitle(data);

    if (title) console.log(`${ip}: ${title}`);
    this.destroy();
}

function task() {
    const conn = new Connection(gen(), 80);

    conn.addListener('ready', sendRequest);
    conn.addListener('end', processResponse);

    conn.addListener('close', () => {
        delete conn;
        task();
    })
};

Promise.all(Array(1024).fill().map(() => new Promise(task)));
