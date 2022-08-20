const net = require('net');

class Connection extends net.Socket {
    constructor(ip, port) {
        super();
        this.setTimeout(750);
        this.setNoDelay(true);
        this.setKeepAlive(false);
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

module.exports = Connection;
