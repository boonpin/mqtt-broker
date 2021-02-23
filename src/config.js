const dotEnv = require('dotenv')

dotEnv.config();

let {
    ID,
    DEBUG,
    HOST,
    PORT,
    SECURE_KEY,
    SSL_CERT,
    SSL_KEY
} = process.env;

DEBUG = ["1", "true"].includes(`${DEBUG}`.toLowerCase())

module.exports = {
    ID,
    DEBUG,
    HOST,
    PORT,
    SECURE_KEY,
    SSL_CERT,
    SSL_KEY
}
