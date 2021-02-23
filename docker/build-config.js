const fs = require('fs');

const config = {
    ID: `mqtt-broker-${(new Date()).getTime()}`,
    DEBUG: true,
    HOST: '0.0.0.0',
    PORT: 1883,
    SECURE_KEY: '',
    SSL_CERT: '',
    SSL_KEY: ''

};

const genRandomKey = (length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#&^*&$') => {
    let result = '';
    for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};

Object.keys(config).forEach(k => {
    const v = process.env[k];
    if (process.env.hasOwnProperty(k)) {
        config[k] = v;
    }
});

fs.writeFileSync('/app/.env', Object.keys(config).map(k => `${k}=${config[k]}`).join('\n'));
