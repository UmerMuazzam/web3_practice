const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");
var aesjs = require("aes-js");
const crypto = require("crypto");
const { Web3 } = require("web3");
// const { abi } = require("./abi");
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];




// const web3 = new Web3("https://eth.llamarpc.com");
// const web3 = new Web3("HTTP://127.0.0.1:7545");
 const web3 = new Web3("https://80002.rpc.thirdweb.com/"); 

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

async function sendEther(privateKey, from, to, value) {
  // check if reciever address valid

  if (!web3.utils.isAddress(to)) {
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
    // here are we signed the transaction
    const signedTransaction = await web3.eth.accounts.signTransaction(
      transaction,
      privateKey
    );
    // send the transaction to the Ethereum network
    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    const transactionDetail = await web3.eth.getTransaction(
      receipt.transactionHash
    );

    return {
      ok: true,
      sender: transactionDetail.from,
      reciever: transactionDetail.to,
      amount: transactionDetail.value,
    };
  } catch (error) {
    console.error("Error sending transaction", error);
    return { ok: false, error: "something went wrong" };
  }
}

function saveCoinTransactionToLocalStorage(res) {
  const coinTransactionHistory =
    JSON.parse(localStorage.getItem("coinTransactionHistory")) || [];
  coinTransactionHistory?.push(res);
  localStorage.setItem(
    "coinTransactionHistory",
    JSON.stringify(coinTransactionHistory)
  );
  console.log("coinTransactionHistory", coinTransactionHistory);
}

function getCoinTransactionHistory(address) {
  const coinTransactionHistory =
    JSON.parse(localStorage.getItem("coinTransactionHistory")) || [];
  console.log("coinTransactionHistory", coinTransactionHistory);
  const filteredTransactions = coinTransactionHistory.filter(
    (transaction) => transaction.sender.toLowerCase() == address.toLowerCase()
  );
  return { coinTransactionHistory, filteredTransactions };
}

function importToken(tokenAddress, accountAddress) {
  // check if deployed token address is correct
  if (!web3.utils.isAddress(tokenAddress)) {
    return { ok: false, message: "Invalid  Address Of Token" }; // check if sendFrom is a valid address
  }
  const deployedTokenAddreses =
    JSON.parse(localStorage.getItem("deployedTokenAddreses")) || {};
  if (!deployedTokenAddreses[accountAddress]) {
    deployedTokenAddreses[accountAddress] = []; // initialize the array if it does not exist
  }
  if (!deployedTokenAddreses[accountAddress].includes(tokenAddress)) {
    deployedTokenAddreses[accountAddress].push(tokenAddress);
  }
  localStorage.setItem(
    "deployedTokenAddreses",
    JSON.stringify(deployedTokenAddreses)
  );
  return { ok: true };
}

function getTokensFromLocalStorage(accountAddress){
  const deployedTokenAddreses = JSON.parse(localStorage.getItem("deployedTokenAddreses"));
  if(deployedTokenAddreses[accountAddress]){
    return deployedTokenAddreses[accountAddress];
  } else {
    return [];
  }
}

async function getAccountTokensDetail(accountAddress){
  const deployedTokenAddreses = JSON.parse(localStorage.getItem("deployedTokenAddreses"));
  if(deployedTokenAddreses[accountAddress]){ 

    try {
      const tokens = deployedTokenAddreses[accountAddress];  // array of token addresses

      const tokenDetails = tokens.map(async (token) => {
        const contract = new web3.eth.Contract(abi, token);
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const totalSupply = web3.utils.fromWei(
          await contract.methods.totalSupply().call(),
          "ether"
        );
        const balance = web3.utils.fromWei(await contract.methods.balanceOf(accountAddress).call(), 'ether')
        return {ok:true, name, symbol, totalSupply, token, balance };
      })

      return await Promise.all(tokenDetails);
    } catch (error) {
      return {ok:false, message:error.message}
    }

  } else {
    return [];
  }
}



async function sendTokens(){
  
}








// *************** calling methods ********************************

const password = "umermuazzam";
const address = localStorage.getItem("address");
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

const to = "0x3c69470288793918B3A40aD6Cd438b2D2C2973b0";
const privateKey =
  "0x31e5db165ddc3cfa62e705b79d0f1fd4c9164147614283fd236a0c79930b3102" ||
  localStorage.getItem("encryptedPrivateKey");
const value = 2;

const from = address;

// sendEther(
//   privateKey,
//   from,
//   to,
//   value
// ).then(res=>{
//   res.amount= web3.utils.fromWei(res.amount,'ether')
//   if(res.ok){
//     saveCoinTransactionToLocalStorage(res)
//   }}).catch(err=> console.log)

// 7

// const {coinTransactionHistory,filteredTransactions} = getCoinTransactionHistory(address);
// console.log("coinTransactionHistory history", coinTransactionHistory);
// console.log("filteredTransactions history", filteredTransactions);

// 8

// const tokenAddress = "0x50349E6a9C32F5Ba78E0B0ec0289e79CbA377823";

// const { ok } = importToken(tokenAddress, address);

// 9

// const response = getTokensFromLocalStorage("0x3fc0A2d8363B5e3120E8dD6F0E9f19fcFfe8CD8b")
// console.log('response',response)

// 10

// const callAsyncFunction=async()=>{
//   try {
//     const response = await getAccountTokensDetail("0x4871DbF6DFFE579cab4065B68D461619D978922f")
//     console.log('response',response)
//   } catch (error) {
//     console.log('error',error.message)
//   }
// }
// callAsyncFunction()

 








