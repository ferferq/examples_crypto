const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const ecdsaSigFormatter = require("ecdsa-sig-formatter");
const keys = require('./keys');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const publicKeyPem = keys.publicKey;
const privateKeyPem = keys.privateKey;

app.get("/get-key", (req, res) => {
  res.send(publicKeyPem);
});

async function verifyRawECDSA(publicKeyBase64, data, signatureBase64) {
  try {
    // Converte a chave pública ECDSA (em base64) para PEM
    const publicKeyBuffer = Buffer.from(publicKeyBase64, "base64");
    const ecdsaPublicKeyPem = `-----BEGIN PUBLIC KEY-----
${publicKeyBuffer.toString("base64")}
-----END PUBLIC KEY-----`;

    // 'ecdsa-sig-formatter' converte r|s (raw) -> DER.
    // 'ES256' => curva P-256 => use "sha256"
    const derSignature = ecdsaSigFormatter.joseToDer(signatureBase64, "ES256");

    // Cria objeto "verifier"
    const verifier = crypto.createVerify("SHA256");
    verifier.update(data);
    verifier.end();

    // Importa a chave pública
    const publicECDSAKey = crypto.createPublicKey({
      key: ecdsaPublicKeyPem,
      format: "pem",
      type: "spki",
    });

    // Verifica
    const isValid = verifier.verify(publicECDSAKey, derSignature);
    return isValid;
  } catch (err) {
    console.error("Erro ao verificar assinatura ECDSA raw:", err.message);
    return false;
  }
}

app.post("/decrypt", async (req, res) => {
  const { encryptedData, encryptedKey, forceInvalid } = req.body;
  try {
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const encryptedBuffer = Buffer.from(encryptedKey, "base64");
    const decryptedKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      encryptedBuffer
    );

    const { key, iv, authTag } = JSON.parse(decryptedKey);

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(key, "base64"),
      Buffer.from(iv, "base64")
    );
    decipher.setAuthTag(Buffer.from(authTag, "base64"));

    const encryptedBufferData = Buffer.from(encryptedData, "base64");
    const decryptedDataBuffer = Buffer.concat([
      decipher.update(encryptedBufferData),
      decipher.final(),
    ]);

    const decryptData = JSON.parse(decryptedDataBuffer.toString());
    const { data, signature, ecdsaPublicKey } = decryptData;

    let dataCompare = data;
    if (forceInvalid) {
      dataCompare = data + '1';
    }
    const isValid = await verifyRawECDSA(ecdsaPublicKey, dataCompare, signature);

    console.log("fer", isValid);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid data", details: "Signature failed" });
    }

    const { cardData } = JSON.parse(data);
    return res.json({ decryptedData: cardData, decryptedKey: { key, iv, authTag } });
  } catch (error) {
    return res.status(500).json({ error: "Failed to decrypt data", details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});