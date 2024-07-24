const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");
var aesjs = require("aes-js");
const crypto = require("crypto");
const { Web3 } = require("web3");

// const web3 = new Web3("https://eth.llamarpc.com");
const web3 = new Web3("HTTP://127.0.0.1:7545");

const generateMnemonics = () => {
  const mnemonic = bip39.generateMnemonic();
  //   console.log("Generated Mnemonic:", mnemonic);
  return mnemonic;
};

const createWallet = (mnemmonics) => {
  try {
    if (!bip39.validateMnemonic(mnemmonics)) {
      return { ok: false, message: "Mnemonics are not valid" };
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    const node = root.derivePath("m/44'/0'/0'/0/0");
    const privateKey = `0x${node.privateKey.toString("hex")}`;
    const myAccount = web3.eth.accounts.wallet.add(privateKey);
    const address = myAccount[0].address;
    localStorage.setItem("address", address);
    //   function to encrypt privateKey and save in localStorage
    encryptPrivateKey(privateKey);
    return { ok: true, address, privateKey };
  } catch (error) {
    return { ok: false, error };
  }
};

function encryptPrivateKey(privateKey) {
  try {
    console.log("private key before encryption", privateKey);
    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    var textBytes = aesjs.utils.utf8.toBytes(privateKey);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    localStorage.setItem("encryptedPrivateKey", encryptedHex);
    console.log("encryptedPrivateKey", encryptedHex);
    decryptPrivateKey(encryptedHex);
    return {
      ok: true,
      message: "Private key encrypted and save to local storage",
    };
  } catch (error) {
    return { ok: false, error: "failed to encrypt " + error };
  }
}

function decryptPrivateKey(encryptedHex) {
  try {
    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    console.log("decryptedPrivateKey", decryptedText);
    return { ok: true, privateKey: decryptedText };
  } catch (error) {
    return { ok: false, error: "decryption failled" + error };
  }
}

function encryptMnemonics(mnemmonics, password) {
  console.log("before encryptMnemonics", mnemmonics);
  try {
    crypto.pbkdf2(
      password,
      "this is just a random string",
      100000,
      32,
      "sha512",
      (err, derivedKey) => {
        if (err) return reject(err);
        const aesCtr = new aesjs.ModeOfOperation.ctr(
          derivedKey,
          new aesjs.Counter(5)
        );
        const encryptedBytes = aesCtr.encrypt(
          aesjs.utils.utf8.toBytes(mnemmonics)
        );
        const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        console.log("after encrypt mnemonics", encryptedHex);
        localStorage.setItem("encryptedMnemonics", encryptedHex);
      }
    );
  } catch (error) {
    console.log("Error while encrypting mnemonics", error);
  }
}

function decryptMnemonics(password, encryptedMnemonics) {
  crypto.pbkdf2(
    password,
    "this is just a random string",
    100000,
    32,
    "sha512",
    (err, derivedKey) => {
      if (err) return reject(err);
      try {
        const encryptedBytes = aesjs.utils.hex.toBytes(encryptedMnemonics);
        const aesCtr = new aesjs.ModeOfOperation.ctr(
          derivedKey,
          new aesjs.Counter(5)
        );
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
        const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

        // Validate the decrypted mnemonic
        if (!bip39.validateMnemonic(decryptedText)) {
          throw new Error("Invalid password or corrupted data");
        }
        console.log("Decrypted mnemonics", decryptedText);
        return { ok: false, message: "successfully decrypted" };
      } catch (error) {
        console.log("Error: ", error.message);
        return { ok: false, error: error.message };
      }
    }
  );
}

async function getAccountBalance(address) {
  try {
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address),
      "ether"
    ); 

    console.log("Account Balance: ", balance);
  } catch (error) {
    console.log("failed to get account balance", error.message);
    return { ok: false, error: error };
  }
}



async function sendEther(privateKey,from,to,value) { 
    // check if reciever address valid 

    if (!web3.utils.isAddress(sendTo)) {
      return { ok: false, message: "Invalid  address of reciever" }; // check if sendFrom is a valid address
    }

    try {
      // used to calculate the transaction's maxFeePerGas
      const block = await web3.eth.getBlock();
      const transaction = {
        from,
        to,
        value: web3.utils.toWei(value, "ether"),
        // the following two properties must be included in raw transactions
        maxFeePerGas: block.baseFeePerGas * 2n,
        maxPriorityFeePerGas: 100000,
      };

      const signedTransaction = await web3.eth.accounts.signTransaction(
        transaction,
        privateKey
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
      console.log(receipt);
      return { ok: true, txHash: receipt.transactionHash };
    } catch (error) {
        console.log('Error sending transaction')
        return { ok: false, error: "something went wrong" };
    }
  
}









const password = "umermuazzam";
const address =
  "0x6cb2F211b645D1f067E12864e2B795B546ce977c" ||
  localStorage.getItem("address");
const encryptedMnemonics = localStorage.getItem("encryptedMnemonics");


// // 1
// const mnemonic = generateMnemonics();
// // 2
// createWallet(mnemonic);

// // 3
// encryptMnemonics(mnemonic, password);

// // 4

// decryptMnemonics(password, encryptedMnemonics)

// 5
// getAccountBalance(address);


// 6


 
const to = "0x6AacBD0282bc413b0E8E494434A70D2cec4e450e";
const privateKey =
  "0xf06b60987e2195101f53b55680e47811ed03cb27d8f6546c0209eab5063fe2f5";
const value=2

const from = "0x6cb2F211b645D1f067E12864e2B795B546ce977c";

const {ok, txHash}= sendEther(privateKey,from, to, value);
if(ok){
    
}
