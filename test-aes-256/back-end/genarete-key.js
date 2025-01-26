const crypto = require('crypto');

const aesKey = crypto.randomBytes(32); // Gera uma chave AES de 256 bits
const iv = crypto.randomBytes(12); // Gera um IV de 96 bits

  console.log({
        key: aesKey.toString("base64"),
        iv: iv.toString("base64"),
    });