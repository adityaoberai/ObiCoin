const SHA256=require('crypto-js/sha256')


class Block
{
    constructor(index, timestamp, data, previousHash='')
    {
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
    }

    calculateHash()
    {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain
{
    constructor()
    {
        this.chain=[this.createGenesisBlock()]; 
    }

    createGenesisBlock()
    {
        return new Block(0,"12/06/2019","Genesis Block","0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock)
    {
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.hash=newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid()
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
//Name of Blockchain and first 3 blocks
let ObiCoin = new Blockchain();
ObiCoin.addBlock(new Block(1, "12/06/2019",{amount: 4}));
ObiCoin.addBlock(new Block(2, "12/06/2019",{amount: 20}));
console.log(JSON.stringify(ObiCoin,null,4));
/* Testing

ObiCoin.chain[1].data = {amount: 100};
console.log(`Is chain valid? `+ObiCoin.isChainValid());

ObiCoin.chain[1].hash = ObiCoin.chain[2].calculateHash();

console.log(`Is chain valid? `+ObiCoin.isChainValid());
*/