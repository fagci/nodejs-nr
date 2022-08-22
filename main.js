const gen = require('./gen');
const Connection = require('./connection');

const PATHS = `
/1
/0/1:1/main
/live/h264
/live
/h264/ch1/sub/av_stream
/stream1
/live.sdp
/image.mpg
/axis-media/media.amp
/1/stream1
/ch01.264
/live1.sdp
/stream.sdp
`.trim().split("\n");

function sendRequest() {
    const path = this._paths.shift();
    this._path = path;
    this._cseq++;
    if (this._cseq > 1) console.log(`${this.remoteAddress} req: ${this._cseq}`)
    this.send(
        `DESCRIBE rtsp://${this.remoteAddress}${path} RTSP/1.0\r\n`
        + `Accept: application/sdp\r\n`
        + `CSeq: ${this._cseq}\r\n`
        + `User-Agent: Lavf59.16.100\r\n\r\n`
    );
    this.end();
}

function processResponse() {
    const data = this.recv();
    const m = data.match(/^(\S+)\s+(\S+)\s+(.+)/);

    if (!m) {
        this.destroy();
        return;
    }

    const [_, proto, code, msg] = m;
    if (code) console.log(`${this.remoteAddress}: ${this._path} ${code}`);

    if (this._paths.length == 0 || code == 403) {
        this.destroy();
        return;
    }

    sendRequest.bind(this)();
}

function task() {
    const conn = new Connection(gen(), 554);

    conn._cseq = 0;
    conn._paths = [...PATHS];

    conn.addListener('connect', sendRequest);
    conn.addListener('end', processResponse);
    conn.addListener('close', task);
};

Promise.all(Array(1024).fill().map(() => new Promise(task)));
