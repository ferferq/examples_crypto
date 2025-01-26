(async () => {
  let encryptedBase64;
    document.getElementById("encryptBtn").addEventListener("click", async () => {
      const publicKeyResponse = await fetch("http://localhost:3000/get-key");
    const publicKeyPem = await publicKeyResponse.text();
  
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
  
    const publicKey = await importPublicKey(publicKeyPem);
      const cardData = {
        cardNumber: document.getElementById("cardNumber").value,
        cardValidate: document.getElementById("cardValidate").value,
        cardCvv: document.getElementById("cardCvv").value,
        cardName: document.getElementById("cardName").value,
        date: new Date().toISOString()
      };
  
      const encodedData = new TextEncoder().encode(JSON.stringify(cardData));
      const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, encodedData);
  
      encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
      document.getElementById("result").textContent = `Encrypted: ${encryptedBase64}`;
      document.getElementById("decryptBtn").classList.remove("hidden");
    });

    document.getElementById("decryptBtn").addEventListener("click", async () => {
      const response = await fetch("http://localhost:3000/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedData: encryptedBase64 })
      });

      const result = await response.json();
      document.getElementById("result").textContent = `Decrypted: ${result.decryptedData}`;
    });
  })();
  