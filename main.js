const {Blockchain,Transaction}=require('./blockchain');
const EC = require('elliptic').ec;
const ec=new EC('secp256k1');

const myKey=ec.keyFromPrivate('bcabe911ae691651e8fd1b18beea5555b757ac98344af33824bc9f9c4f21bee3');//created from keygenerator.js earlier
const myWalletAddress=myKey.getPublic('hex');

let ObiCoin = new Blockchain();

//Test Cases

const tx1 = new Transaction(myWalletAddress,'public key goes here',10);
tx1.signTransaction(myKey);
ObiCoin.addTransaction(tx1);

console.log('\n Starting the miner...');
ObiCoin.minePendingTransactions(myWalletAddress);
console.log('Balance of Aditya is', ObiCoin.getBalanceOfAddress(myWalletAddress));

ObiCoin.chain[1].transactions[0].amount=1;

console.log('Is chain valid?',ObiCoin.isChainValid());