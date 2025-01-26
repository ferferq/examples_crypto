const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const keys = require('./keys');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const publicKeyPem = keys.publicKey;
const privateKeyPem = keys.privateKey;


app.get("/get-key", (req, res) => {
  res.send(publicKeyPem);
});


app.post("/decrypt", (req, res) => {
  const { encryptedData, encryptedKey } = req.body;

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
    const {key, iv, authTag} = JSON.parse(decryptedKey);
    
    const decipher = crypto.createDecipheriv(
                "aes-256-gcm",
                Buffer.from(key, "base64"),
                Buffer.from(iv, "base64")
            );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
    
  const encryptedBufferCard = Buffer.from(encryptedData, "base64");
  const decryptedDataCard = Buffer.concat([
                decipher.update(encryptedBufferCard),
                decipher.final(),
  ]);
  
  const cardData = JSON.parse(decryptedDataCard.toString());

  console.log(cardData);

  res.json({ decryptedData: cardData, decryptedKey:  {key, iv, authTag } });
  } catch (error) {
    res.status(500).json({ error: "Failed to decrypt data", details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server on http://localhost:${PORT}`);
});
