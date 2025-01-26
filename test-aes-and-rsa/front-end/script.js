(async () => {
  let encryptedCardBase64;
  let encryptedKeyBase64;

  document.getElementById("encryptBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const cardData = {
      cardNumber: document.getElementById("cardNumber").value,
      cardValidate: document.getElementById("cardValidate").value,
      cardCvv: document.getElementById("cardCvv").value,
      cardName: document.getElementById("cardName").value,
      date: new Date().toISOString()
    };

    const publicKeyResponse = await fetch("http://localhost:3000/get-key");
    const publicKeyRsaPem = await publicKeyResponse.text();

    const importPublicKey = async (pemKey) => {
      const pem = pemKey.replace(/-----BEGIN PUBLIC KEY-----/, "").replace(/-----END PUBLIC KEY-----/, "").replace(/\n/g, "");
      const binaryDer = Uint8Array.from(atob(pem), c => c.charCodeAt(0)).buffer;

      return await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
      );
    };

    const publicKeyRsa = await importPublicKey(publicKeyRsaPem);
    
    const generateAesKey = async () => {
      const aesKey = window.crypto.getRandomValues(new Uint8Array(32)); // 32 bytes para AES-256
      const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes para IV (96 bits)
    
      return {
        key: arrayBufferToBase64(aesKey),
        iv: arrayBufferToBase64(iv),
      };
    };

    const arrayBufferToBase64 = (buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
      });
      return window.btoa(binary);
    };

    const { key, iv } = await generateAesKey();

    const importedKeyAes = await window.crypto.subtle.importKey(
      "raw",
      Uint8Array.from(atob(key), (c) => c.charCodeAt(0)),
      { name: "AES-GCM" },
      false,
      ["encrypt"]
  );
  const encodedCardData = new TextEncoder().encode(JSON.stringify(cardData));

   const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
   const encryptedCard = await window.crypto.subtle.encrypt(
       { name: "AES-GCM", iv: ivBuffer },
       importedKeyAes,
       encodedCardData
   );

   const encryptedBytes = new Uint8Array(encryptedCard);
   const tagLength = 16;
   const authTag = encryptedBytes.slice(-tagLength);
   const encryptedCardData = encryptedBytes.slice(0, -tagLength);

   encryptedCardBase64 = btoa(String.fromCharCode(...encryptedCardData));
   const authTagBase64 = btoa(String.fromCharCode(...authTag));

    const encodedKeyData = new TextEncoder().encode(JSON.stringify({
      key, iv, authTag: authTagBase64,
    }));
    const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKeyRsa, encodedKeyData);

    encryptedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));

    document.getElementById("result").textContent = `Encrypted key: ${encryptedKeyBase64} Encrypted data: ${encryptedCardBase64}`;
    document.getElementById("decryptBtn").classList.remove("hidden");
  });

  document.getElementById("decryptBtn").addEventListener("click", async () => {
    document.getElementById("decryptBtn").disabled = true;
    const response = await fetch("http://localhost:3000/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encryptedKey: encryptedKeyBase64, encryptedData: encryptedCardBase64 })
    });

    const result = await response.json();
    document.getElementById("result").textContent = `Decrypted data: ${JSON.stringify(result.decryptedData)} decrypt key: ${JSON.stringify(result.decryptedKey)}`;
    document.getElementById("decryptBtn").disabled = false;
    document.getElementById("decryptBtn").classList.add("hidden");
  });
})();
