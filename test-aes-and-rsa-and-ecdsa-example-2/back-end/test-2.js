const ecdsaSigFormatter = require('ecdsa-sig-formatter');

// Suppose you have a JOSE-format signature in base64url form, e.g. from a JWT
// If it's normal base64, convert it to base64url first or parse accordingly
const joseSignatureBase64Url = '9dIJnBR2lMJwb7tlCNhrFXA+V0WOECS36cNvRTIscbGjyGgKkBnw8Ct+dNRYbSAI6f3ujLVSqAr99gullf20VQ=='; // Example only

// Convert JOSE -> DER
// The 2nd argument 'ES256' indicates ECDSA with P-256
const derSignature = ecdsaSigFormatter.joseToDer(joseSignatureBase64Url, 'ES256');

// Now you can use 'derSignature' in crypto.createVerify(...).verify(...)
console.log('DER signature length:', derSignature.length);