const jwt = require('jsonwebtoken');
const tls = require('tls');
const net = require('net');
const Aedes = require('aedes');
const fs = require('fs');

const {ID, DEBUG, HOST, PORT, SECURE_KEY, SSL_CERT, SSL_KEY} = require('./config');

console.log(`debug mode [${DEBUG ? 'ON' : 'OFF'}]`)

const aedes = Aedes({id: ID})

aedes.on('client', (c) => {
    if (DEBUG) {
        const {conn, id} = c;
        console.log(`client connected, id=[${id}], ip=[${conn.remoteAddress}:${conn.remotePort}]`)
    }
})
aedes.on('clientDisconnect', (c) => {
    if (DEBUG) {
        const {conn, id} = c;
        console.log(`client disconnect, id=[${id}], ip=[${conn.remoteAddress}:${conn.remotePort}]`)
    }
})

aedes.authenticate = (client, username, password, callback) => {
    const {conn, id} = client;
    const clientIpPort = `${conn.remoteAddress}:${conn.remotePort}`;
    try {
        if (`${username}`.toLowerCase() === 'jwt') {
            const token = password.toString();
            jwt.verify(token, SECURE_KEY);
            const usr = jwt.decode(token);
            if (usr) {
                console.log(`success authenticate client, id=[${id}], ip=[${clientIpPort}]`);
                return callback(null, true);
            }
            callback(new Error(`invalid credential`), false)
        } else {
            callback(new Error(`unsupported username`), false)
        }
    } catch (error) {
        console.log(`error on authenticate client [${clientIpPort}]: ${error.message}`)
        error.returnCode = 2;
        callback(error, false)
    }
}

aedes.authorizePublish = (client, packet, callback) => {
    if (client && packet.cmd === 'publish') {
        let v = packet.payload.toString();
        try {
            v = JSON.parse(v)
        } catch (err) {
            console.warn(v);
        }
        const {conn, id} = client;
        const intercepted = JSON.stringify({
            body: v,
            headers: {
                client: {id, ip: conn.remoteAddress}
            }
        });
        packet.payload = Buffer.from(intercepted, "utf-8")
    }
    callback(null);
}

// ----
const server = (SSL_CERT && SSL_KEY) ? tls.createServer({
    cert: fs.readFileSync(SSL_CERT),
    key: fs.readFileSync(SSL_KEY)
}, aedes.handle) : net.createServer(aedes.handle)

server.listen(PORT, HOST, function () {
    console.log(`mqtt broker started ${HOST}:${PORT}`)
});
