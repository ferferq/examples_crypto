const crypto = require("crypto");

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
