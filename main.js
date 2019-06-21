const SHA256=require('crypto-js/sha256')

class Transaction//transactions in cryptocurrency
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
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

    calculateHash()
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
        return new Block("12/06/2019","Genesis Block","0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress)
    {
        let block=new Block(Date.now(), this.pendingTransactions);//not taking in account real payment from miners for mined block right now
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions=[ 
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];//clearing pending transactions
        
         //Note: This code can be edited by a user to give himself a larger reward. However an actual cryptocurrency is powered by a P2P network so those changes to code will not be approved.
    }

    createTransaction(transaction)//adding transaction to pending trabsactions
    {
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
            const previousBlock=this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.calculateHash())
            {
                return false;
            }

            return true;
        }
    }
}
//Name of Cryptocurrency
let ObiCoin = new Blockchain();

//Test cases
ObiCoin.createTransaction(new Transaction('address1','address2',100));
ObiCoin.createTransaction(new Transaction('address2','address1',50));

console.log('\n Starting the miner...');
ObiCoin.minePendingTransactions('adi1');
console.log('Balance of Aditya is', ObiCoin.getBalanceOfAddress('adi1'));

console.log('\n Starting the miner again...');
ObiCoin.minePendingTransactions('adi1');
console.log('Balance of Aditya is', ObiCoin.getBalanceOfAddress('adi1'));
