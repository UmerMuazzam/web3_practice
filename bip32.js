const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = BIP32Factory(ecc)

// Generate a mnemonic
const mnemonic = bip39.generateMnemonic();
console.log('Mnemonic:', mnemonic);

// Validate the mnemonic
if (!bip39.validateMnemonic(mnemonic)) {
  throw new Error('Invalid mnemonic');
}

// Convert mnemonic to seed
const seed = bip39.mnemonicToSeedSync(mnemonic);
console.log('Seed:', seed.toString('hex'));

// Create the root key from the seed
const root = bip32.fromSeed(seed);

// Derive the first account: m/44'/0'/0'/0/0
const account = root.derivePath("m/44'/0'/0'/0/0");

// Get the private and public keys
const privateKey = account.privateKey.toString('hex');
const publicKey = account.publicKey.toString('hex');

console.log('Account Private Key:', privateKey);
console.log('Account Public Key:', publicKey);

// Get the Bitcoin address (compressed)
const { address } = bitcoin.payments.p2pkh({ pubkey: account.publicKey });
console.log('Bitcoin Address:', address);
