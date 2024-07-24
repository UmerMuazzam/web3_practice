const CryptoJS = require("crypto-js");

// Define the data to be encrypted
const data = "Hello, world!";
const key = "mysecretkey12345"; // Use a 16, 24, or 32 character key for AES-128, AES-192, AES-256

// Encrypt the data
const encrypted = CryptoJS.AES.encrypt(data, key).toString();
console.log("Encrypted:", encrypted);

// Decrypt the data
try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, key+'u');
    const originalData = decrypted.toString(CryptoJS.enc.Utf8);
    if(data !== originalData) throw new Error("decryption failled")
    console.log("Decrypted:", originalData);
} catch (error) {
    console.log("error:", error.message);
}
