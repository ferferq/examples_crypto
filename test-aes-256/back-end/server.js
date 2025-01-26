const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let aesKey = "UUrDXR9m6dxvBRQve5kXt/cRMseksO1RpJ9fovdnmDk=";

app.get("/get-key", (req, res) => {
    const iv = crypto.randomBytes(12);
    res.json({
        key: aesKey,
        iv: iv.toString("base64"),
    });
});

app.post("/decrypt", (req, res) => {
    const { encryptedData, iv: receivedIv, authTag } = req.body;

    try {
        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            Buffer.from(aesKey, "base64"),
            Buffer.from(receivedIv, "base64")
        );
        decipher.setAuthTag(Buffer.from(authTag, "base64"));

        const encryptedBuffer = Buffer.from(encryptedData, "base64");
        const decryptedData = Buffer.concat([
            decipher.update(encryptedBuffer),
            decipher.final(),
        ]);

        res.json({ decryptedData: decryptedData.toString() });
    } catch (error) {
        res.status(500).json({ error: "Failed to decrypt data", details: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`service on http://localhost:${PORT}`);
});
