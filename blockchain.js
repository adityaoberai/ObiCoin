const SHA256=require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec=new EC('secp256k1');

class Transaction//transactions in cryptocurrency
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }

    calculateHash()//calculating hash value based on inputted values
    {
        return SHA256(this.fromAddress+this.toAddress+this.amount).toString();
    }

    signTransaction(signingKey)//used to sign transaction based on generated key from keygenerator.js
    {
        if(signingKey.getPublic('hex') !== this.fromAddress)
        {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx=this.calculateHash();
        const sig=signingKey.sign(hashTx, 'base64');
        this.signature=sig.toDER('hex');
    }

    isValid()//checking validity of public key
    {
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0)
        {
            throw new Error('No signature in this transaction!');
        }

        const publicKey=ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}

class Block//creation of blocks in blockchain
{
    constructor(timestamp, transactions, previousHash='')
    {
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;//used to implement Proof-of-Work
    }

    calculateHash()//calculating hash from given details im constructor
    {
        return SHA256(this.timestamp + JSON.stringify(this.transactions)+this.nonce).toString();
    }

    mineBlock(difficulty)//implementing Proof-of-Work
    {
        while(this.hash.substring(0,difficulty)!== Array(difficulty+1).join("0"))
        {
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block mined ="+this.hash);
    }

    hasValidTransactions()//verifies validity of all transactions
    {
        for(const tx of this.transactions)
        {
            if(!tx.isValid())
            {
                return false;
            }
        }

        return true;
    }
}

class Blockchain//creation of blockchain
{
    constructor()
    {
        this.chain=[this.createGenesisBlock()]; 
        this.difficulty=1;//taking a random difficulty value right now 
        this.pendingTransactions=[];
        this.miningReward=100;//taking random value for miner reward
    }

    createGenesisBlock()//creation of first block
    {
        return new Block("12/06/2019",[],"0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress)
    {
        const rewardTx=new Transaction(null,miningRewardAddress,this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block=new Block(Date.now(), this.pendingTransactions,this.getLatestBlock().hash); //not taking in account real payment from miners for mined block right now
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions=[ 
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];//clearing pending transactions
        
         //Note: This code can be edited by a user to give himself a larger reward. However an actual cryptocurrency is powered by a P2P network so those changes to code will not be approved.
    }

    addTransaction(transaction)//adding transaction to pending transactions
    {
        if(!transaction.fromAddress|| !transaction.toAddress)
        {
            throw new Error('Transaction must include valid from and to address');
        }

        if(!transaction.isValid())
        {
            throw new Error('Cannot add invalid transaction to the chain');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)//checking balance of particular user
    {
        let balance=0;

        for(const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(trans.fromAddress === address)
                {
                    balance-=trans.amount;
                }

                if(trans.toAddress === address)
                {
                    balance+=trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid()//checking validity of block
    {
        for(let i=1; i<this.chain.length; i++)
        {
            const currentBlock=this.chain[i];

            if(!currentBlock.hasValidTransactions())
            {
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }

            return true;
        }
    }
}

module.exports.Blockchain=Blockchain;
module.exports.Transaction=Transaction;