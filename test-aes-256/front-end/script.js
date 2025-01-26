(async () => {
    document.getElementById("encryptBtn").addEventListener("click", async () => {
        const keyResponse = await fetch("http://localhost:3000/get-key");
        const { key, iv } = await keyResponse.json();

        const cardData = {
            cardNumber: document.getElementById("cardNumber").value,
            cardValidate: document.getElementById("cardValidate").value,
            cardCvv: document.getElementById("cardCvv").value,
            cardName: document.getElementById("cardName").value,
            date: new Date().toISOString(),
        };

        const encodedData = new TextEncoder().encode(JSON.stringify(cardData));
        const importedKey = await window.crypto.subtle.importKey(
            "raw",
            Uint8Array.from(atob(key), (c) => c.charCodeAt(0)),
            { name: "AES-GCM" },
            false,
            ["encrypt"]
        );
        const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: ivBuffer },
            importedKey,
            encodedData
        );

        const encryptedBytes = new Uint8Array(encrypted);
        const tagLength = 16;
        const authTag = encryptedBytes.slice(-tagLength);
        const encryptedData = encryptedBytes.slice(0, -tagLength);

        const encryptedBase64 = btoa(String.fromCharCode(...encryptedData));
        const authTagBase64 = btoa(String.fromCharCode(...authTag));

        document.getElementById("result").textContent = `Encrypted: ${encryptedBase64}`;
        document.getElementById("decryptBtn").classList.remove("hidden");

        document.getElementById("decryptBtn").addEventListener("click", async () => {
            const response = await fetch("http://localhost:3000/decrypt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    encryptedData: encryptedBase64,
                    iv,
                    authTag: authTagBase64,
                }),
            });

            const result = await response.json();
            document.getElementById("result").textContent = `Decrypted: ${result.decryptedData}`;
        });
    });
})();
