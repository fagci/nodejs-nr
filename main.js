const gen = require('./gen');
const Connection = require('./connection');

const FAKE_PATH = '/' + Math.random().toString(36).slice(2, 7);

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
    this.send(
        `DESCRIBE rtsp://${this.remoteAddress}${path} RTSP/1.0\r\n`
        + `Accept: application/sdp\r\n`
        + `CSeq: ${this._cseq}\r\n`
        + `User-Agent: Lavf59.16.100\r\n\r\n`
    );
}

function processResponse() {
    const data = this.recv();
    const m = data.match(/^(\S+)\s+(\S+)\s+(.+)/);

    if (!m) {
        this.destroy();
        return;
    }

    const [_, proto, code, msg] = m;

    if (!proto.match(/^RTSP/) || this._paths.length == 0 || code == 403 || (this._path == FAKE_PATH && code[0] == 2)) {
        this.destroy();
        return;
    }

    if (code[0] == 2) console.log(`rtsp://${this.remoteAddress}${this._path} ${code}`);

    sendRequest.bind(this)();
}

function task() {
    const conn = new Connection(gen(), 554);

    conn._cseq = 0;
    conn._paths = [FAKE_PATH, ...PATHS];

    conn.addListener('connect', sendRequest);
    conn.addListener('data', processResponse);
    conn.addListener('close', task);
};

Promise.all(Array(1024).fill().map(() => new Promise(task)));
