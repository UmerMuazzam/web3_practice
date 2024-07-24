const bip39 = require('bip39');
const crypto = require('crypto');
const aes = require('aes-js');
const { LocalStorage } = require('node-localstorage');

// Set up node-localstorage
const localStorage = new LocalStorage('./scratch');

// Generate a new mnemonic (BIP39)
const generateMnemonic = () => {
    const mnemonic = bip39.generateMnemonic();
    console.log("Generated Mnemonic:", mnemonic);
    return mnemonic;
}

// Validate a mnemonic
const validateMnemonic = (mnemonic) => {
    const isValid = bip39.validateMnemonic(mnemonic);
    console.log("Mnemonic is valid:", isValid);
    return isValid;
}

// Encrypt mnemonics
const encryptMnemonics = (mnemonic, password) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, 'this is just a random string', 100000, 32, 'sha512', (err, derivedKey) => {
            if (err) return reject(err);
            const aesCtr = new aes.ModeOfOperation.ctr(derivedKey, new aes.Counter(5));
            const encryptedBytes = aesCtr.encrypt(aes.utils.utf8.toBytes(mnemonic));
            const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);
            localStorage.setItem("mnemmonics", encryptedHex);
            resolve(encryptedHex);
        });
    });
}

// Decrypt mnemonics
const decryptMnemonics = (password) => {
    return new Promise((resolve, reject) => {
        const encryptedMnemonics = localStorage.getItem("mnemmonics") ;
        crypto.pbkdf2(password, 'this is just a random string', 100000, 32, 'sha512', (err, derivedKey) => {
            if (err) return reject(err);
            try {
                const encryptedBytes = aes.utils.hex.toBytes(encryptedMnemonics);
                const aesCtr = new aes.ModeOfOperation.ctr(derivedKey, new aes.Counter(5));
                const decryptedBytes = aesCtr.decrypt(encryptedBytes);
                const decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);
                
                // Validate the decrypted mnemonic
                if (!bip39.validateMnemonic(decryptedText)) {
                    throw new Error('Invalid password or corrupted data');
                }
                
                resolve(decryptedText);
            } catch (error) {
                reject('Decryption failed: ' + error.message);
            }
        });
    });
}

// Example usage
const password = "your-secure-password";
const mnemonic = generateMnemonic();
validateMnemonic(mnemonic);

encryptMnemonics(mnemonic, password)
    .then(encrypted => {
        console.log("Encrypted Mnemonic:", encrypted);
        return decryptMnemonics(password);
    })
    .then(decrypted => {
        console.log("Decrypted Mnemonic:", decrypted);
    })
    .catch(error => {
        console.error("Error:", error);
    });
