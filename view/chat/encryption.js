function encrypt(plainText, key) {
    key = CryptoJS.enc.Utf8.parse(key);
    const iv1 = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        keySize: 16,
        iv: iv1,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}

function decrypt(cipher, key) {
    key = CryptoJS.enc.Utf8.parse(key);
    const iv1 = CryptoJS.enc.Utf8.parse(key);
    const plainText = CryptoJS.AES.decrypt(cipher, key, {
        keySize: 16,
        iv: iv1,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return plainText.toString(CryptoJS.enc.Utf8);
}