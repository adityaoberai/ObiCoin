const EC = require('elliptic').ec;//Elliptic curve
const ec=new EC('secp256k1');//algorithm that is basis of Bitcoin wallets

const key=ec.genKeyPair();
const publicKey=key.getPublic('hex');
const privateKey=key.getPrivate('hex');

console.log('\nPrivate key:',privateKey);
console.log('\nPublic key:',publicKey);