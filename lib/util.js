"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = void 0;
const crypto_1 = require("crypto");
async function hash(salt, password) {
    return new Promise((res, rej) => {
        crypto_1.pbkdf2(password, salt, 10000, 512, 'sha256', (err, data) => {
            if (err)
                return rej(err);
            else
                return res(data.toString('hex'));
        });
    });
}
exports.hash = hash;
