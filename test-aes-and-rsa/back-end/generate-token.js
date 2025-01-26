const crypto = require("crypto");
const fs = require("fs");

const generateKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
};

const { publicKey, privateKey } = generateKeys();

console.log("Chave Pública:", publicKey);
console.log("Chave Privada:", privateKey);

// Salva as chaves em um arquivo JSON
const keys = { publicKey, privateKey };
fs.writeFileSync("keys.json", JSON.stringify(keys, null, 2), "utf-8");

console.log("Chaves salvas em 'keys.json'");