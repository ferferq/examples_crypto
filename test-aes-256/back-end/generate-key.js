const crypto = require('crypto');
const fs = require("fs");

const aesKey = crypto.randomBytes(32); // Gera uma chave AES de 256 bits

const privateKey = aesKey.toString("base64");
  console.log({
        privateKey,
    });

// Salva as chaves em um arquivo JSON
const keys = { privateKey };
fs.writeFileSync("keys.json", JSON.stringify(keys, null, 2), "utf-8");