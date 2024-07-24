const bip39 = require('bip39');
const crypto = require('crypto');
const aes = require('aes-js');
const { LocalStorage } = require('node-localstorage');
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = BIP32Factory(ecc)

// Set up node-localstorage
const localStorage = new LocalStorage('./scratch');



 

// Generate a mnemonic phrase
const mnemonic = bip39.generateMnemonic();
console.log('Mnemonic:', mnemonic);

// Validate the mnemonic phrase
const isValid = bip39.validateMnemonic(mnemonic);
console.log('Is Valid Mnemonic:', isValid);

if (isValid) {
  // Convert the mnemonic phrase into a seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  console.log('Seed:', seed.toString('hex'));

  // Convert the seed to a BIP32 root key
  const root = bip32.fromSeed(seed);

  // Derive the first account (m/44'/0'/0'/0/0)
  const account = root.derivePath("m/44'/0'/0'/0/0");

  console.log('Account Private Key:', account.privateKey.toString('hex'));
  console.log('Account Public Key:', account.publicKey.toString('hex'));
  
  // Further steps are required to get the address from the public key, specific to the cryptocurrency (e.g., Bitcoin, Ethereum)
}
