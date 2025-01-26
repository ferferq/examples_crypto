const crypto = require("crypto");

const decryptRSA = (encryptedKey, privateKeyPem) => {
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const encryptedBuffer = Buffer.from(encryptedKey, "base64");
  
    return crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      encryptedBuffer
    );
  };
// Exemplo
const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCZxv0oQxR9O1uR
R2hMr9mFrHETGoJBq4zuK3IyTDEJYA4IGN4ZV49Qw80jybIA/6yjXoBsas9k5P6p
dc/iYs0KeHDw6xyrHKMVDHTDY+b/ntAlElCuXUbTcj3JoigmtHTuTJX+XvT1pQ4n
BTWC1m/2oeIqKOLfMm1vhFQKk0WOeHUTPd/z8yfTFjWl6c2nlWQMYCihDj1kp96F
nnQRzBWKAmST9BFa6XPZUktgujH8axy3FQIIhAFRMD3boqQDBB3eNJqGAWOADJG0
3nKf1aZeV5s8zn8Fc01N/p2xrEMcodf1qXGw1VzuJ82ALqMGQH6PAlvWVRnZ78h+
/mLp2HKFAgMBAAECggEABnCs/YNXAlT6ur+GK2AEo3KGBx90a7z8LqVR0lrFME1T
iRycK0Iy1au9laLGz6qQLQSyKtg2TgAWd5EK3xegMAYR73pekv6ksyb4ZOPJiCm7
Mdzt1WpBTcMFD21jx8CFp807+Dvl1RElN0Eil+jUe5HACl/3+xJTlE4IbwDynXV2
uHCisfacY0vzYzpod5nc9DLvgFUH1NaHoGWOr1/A2+ucM3HwcfzdnA8htGVhFAIm
zCOSfzNoDHmdJ+2kcRzL57wnBnZ6bGH9laz4EhGFm0PW4DT5VR5fKB1NeN9gHKeA
W6OiZtgvu+vFhstFPBRh/YkgwSiWZsURlA45L6Zd6QKBgQDIJWGD3BhNRYliNP8y
Av46D9Z9vKqs//ThNh3RvrjErvVx3HeZQq3oAzMc1Nx7nPqiq7zHA6mfPM+qZutw
aNMfaxV4wG13fm3WLzoXVGb4QB9hdVw5FebU3xYIgDUSZrlkev8HWRvTNPs14ysz
f8f4+kIeuQBMNjUtBEhYZAGQBwKBgQDEsPu3sUIqhs2OD68hBVBJsW7lOWc3rExY
4RUlcKH//QUaGncxpnFuxhJ06tcLvha8fSn4eaNsOedrVF5/JO0vBpwraifUm6qc
thd6SdqIXONF5m03oBvVqOF4cvzZp3SzG8cjqQC+YXuNPQ5Ao5t2CxoQQVVXfjiN
0aiuQfquEwKBgAhHe5Qvy5WOtdMpLBFOjGOsegvzfP/xCpkyWuNtR0ljj2WpYA0n
8/ewAjJEH+bBJKEMB6AX57Fdm52J6l1ZCLq4/EdldmHGChcdFwMWC7hjNqkaaLk3
zbeqjsfFPezH8Q1WBSyxo/QFsgqVnhjgRU5oU8nfj0KXz3VQQwndAS+LAoGAPYvP
yCP8O0hhK7G2sBN0kwqlU67JoH8WiL0tm8CJwItQvGFJqMyXM/1gqxsM3UzG2oYj
yu9s9qGLy2bkBs7sNMnRtjgKbJmlIlJMOGTBr+e46hd3V2+PJiUpIEKC4ixm9OCd
SIhKhkgEnCZdvlYzgBVrO2jmJnGFisLvEE/u++cCgYEAvz/wudUGlAjbb5M20DbF
CTrvOKkD6LNV+i8pXd76dPqllwOsavhruelxh9/ntVuqnHfMYyZk9WTgFPTVY99C
SybgXehyrAUTN6Mu5m5z8u65SGlJyK9fGviBq//lmkVS/1I6jeLh1JCXI+pk2ZAh
BqGs+TxLRzGLTo+vy78uQEc=
-----END PRIVATE KEY-----`;

const encryptedKeyBase64 = "lMQhM6qiYC1hgC+lQ8jPvH9ojVFefTZcL1Sr2xqba3zEMLVnEK35/UkOcVYL+CJpa1XJAdoYPwi+vftuWkqwylbZhd4qJH86+YqgpqVlMmHeF1a5DdrCoxauwcOr+sf0w55iXrRvyhcj0shoJVCzO5AO4eVmUayidVlNAOwZSnBByzJMwv2NXehHF52OWOoIqjMxLtI1cMv4iJf8K4h4uC6Wrq44YMmCSo2N8zepBczhb1EPnGaVn5ie0T5MhnY1BIuhr15YwJVG8NyUFzvmAksfc78OwWNJPC4GNQYq02IJ85PsoNReW0Nzhyu3VJC4e8xW3S/LF9EClQA/XnmgLw==";

try {
  const decryptedData = decryptRSA(encryptedKeyBase64, privateKeyPem);
  console.log("Dados descriptografados:", decryptedData.toString());
} catch (error) {
  console.error("Erro na descriptografia:", error);
}
