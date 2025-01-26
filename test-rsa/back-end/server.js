const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1VGY7TLnka1/n8nmJ+Ds
yQxSZyqOLRIL8W0utZH1f1iMoWYQJILh1GvIejIp9O/tkADAbpxa/3357jQfj6SE
uIvh0aZzKdbuazy6RaLaewBtSfxLK/5zTkKuHye8Uk+4DwpzUWh7QGACP9o8DiiB
5NGk+5EjwlSrNduXzBPfZeVC+LACofaheel9AmmK5+anaXJOMb4PC21p0+53Cw/Y
ZcuBjdw/uyeoo2JynzqyY+Q/nUPxRBkuMx8ZP18oJQ1YULP9mY7dRx/x3HvjFL+K
J/UH/4rFg17U/1DEwmLeEJiz4iAzWrL9QKMzQYgRv23CyRKSjwCKBIbnrDZiJQX1
1wIDAQAB
-----END PUBLIC KEY-----`;
const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDVUZjtMueRrX+f
yeYn4OzJDFJnKo4tEgvxbS61kfV/WIyhZhAkguHUa8h6Min07+2QAMBunFr/ffnu
NB+PpIS4i+HRpnMp1u5rPLpFotp7AG1J/Esr/nNOQq4fJ7xST7gPCnNRaHtAYAI/
2jwOKIHk0aT7kSPCVKs125fME99l5UL4sAKh9qF56X0CaYrn5qdpck4xvg8LbWnT
7ncLD9hly4GN3D+7J6ijYnKfOrJj5D+dQ/FEGS4zHxk/XyglDVhQs/2Zjt1HH/Hc
e+MUv4on9Qf/isWDXtT/UMTCYt4QmLPiIDNasv1AozNBiBG/bcLJEpKPAIoEhues
NmIlBfXXAgMBAAECgf8Wj0sG/k8LVKXWKEGlXOC2UF8PAm4GRdLH1hVCXLnBs4uS
uq7p+QimYtd2vCOw+JDgRGnFPHeh7+EOjM580hkYqghlRUnPxo28rehAjM7/6RxR
kk+730SO+zKWhfmsr4SWy/w6DJlREtCczjgXTOEl1CUoMfCacFXsj1zLhql9WTfI
+s1CaNs3THIcHlV+kwlPr9UzpAkdOAhBdnBWK6BpYX0QW5dpwAZW4h6RGjsAGd01
O2wupD6j4rt4fcxkEZ3o45ZevIZmvBgjsIQ8FAGH/xQhmQ+gxQpfOVOTKvn0ikKl
YeCCmzuyLiybPjmExe29TYNX9X9wRdxKoMrvdx0CgYEA71n2imMpB42OWwlj6vCl
npL585ZlrlhrAYQenyL32S5xJqzte3oIujkn91q+cTpN5gM7A6rMkzcpbk2AHXqE
0ie9j5Zz0oASU22ktnDGx2CDVUudlKDIyhQOoZSloj+GUp7G2enhGmhX3znBXxyl
wSLP1ri+9AuAYojBS9Uhue0CgYEA5CgUov9igJB6gorPJRJDv778ObMegaij2Flj
hORzpPeT3YvQaLiQNrLBfkPhRGVVW9ipzlkExc2Gpf/cFHkLw72hFeNdLgDeX0Ke
gBv5aFLi4Ki1Mjwi01x6qhs3K6pk/jk7tfx7xLRH4R/6U/l6VZOFB4cBAuCMhtYC
sCHDplMCgYEAgKEEUZLAtgJpApulStlQ6EtscG/e7TcvKn1qR3NvZxQCUxqT9cu7
bPjSdagauJbwzi/mQy5DCsqWRWT4+N6jCp24zbW5QOL69kLyRemNqhBABFLCuOE/
hvoIcuWDrhIdicEydGGwS5TPxHMxbH/kxEqFD4vxcw3LTSjZWHuNyHECgYBFAdJs
Em5KkGhdf3pzrfiL0EodcY2yjb0wvKibEzXfGXrBsX4RjnEf+iUH+aPyuet9YiTJ
4qbM5QLqxl5cWtgyFfLY2fHe7ihUC6RA/zUKVreEV8KmNQYbg4ceWCjxrhHpyonC
22Db9+MdtjxSlcxogbvksPKfWidmyOf7OdshPQKBgE1Xd2QUIvQOaYmXjnNI9bFm
rAx7JH500nbcpA5EE7ZU4sb7bJOSLUnhqwhvHU9og4V0z/CpjBl+DJUKSYfDM+3E
Go9cZeqEWW1Y1ds86my1UzW1dJV85TrP4DcNvyKWjPu7vlaOEYAcCEnHqj/wWEOo
u1bN4VzMWNDM+KBoT+qK
-----END PRIVATE KEY-----`;


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

    res.json({ decryptedData: decryptedData.toString() });
  } catch (error) {
    res.status(500).json({ error: "Failed to decrypt data", details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server on http://localhost:${PORT}`);
});
