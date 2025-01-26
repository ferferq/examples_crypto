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
  const { encryptedData } = req.body;

  try {
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const encryptedBuffer = Buffer.from(encryptedData, "base64");
    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      encryptedBuffer
    );

    const data = decryptedData.toString();
    console.log("data", data)
    res.json({ decryptedData: data });
  } catch (error) {
    res.status(500).json({ error: "Failed to decrypt data", details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server on http://localhost:${PORT}`);
});
