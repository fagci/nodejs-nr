const net = require('net');

class Connection extends net.Socket {
    constructor(ip, port, connTimeout = 750, opTimeout = 5000) {
        super();
        this.setTimeout(connTimeout);
        this.setNoDelay(true);
        this.setKeepAlive(false);
        this._recved = '';
        this._opTimeout = opTimeout;

        this.addListener('error', this.destroy);
        this.addListener('timeout', this.destroy);
        this.addListener('data', data => this._recved += data);
        this.addListener('close', () => this.clearOpTimeout())

        this.connect(port, ip);
    }

    setOpTimeout() {
        this._opTimeoutHandle = setTimeout(() => {
            this.destroy();
        }, this._opTimeout);
    }

    clearOpTimeout() {
        clearTimeout(this._opTimeoutHandle);
    }

    send(data) {
        this._recved = '';
        this.write(data);
        this.setOpTimeout();
    }

    recv() {
        return this._recved;
    }
}

module.exports = Connection;
