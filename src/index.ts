import * as crypto from 'crypto-js';

class Block {
   public index: number;
   public hash: string;
   public previousHash: string;
   public data: string;
   public timestamp: number;

   static calculateBlockHash = (
      index: number,
      previousHash: string,
      timestamp: number,
      data: string
   ): string =>
      crypto.SHA256(index + previousHash + timestamp + data).toString();

   static validateStructure = (block: Block): boolean =>
      typeof block.index === 'number' &&
      typeof block.hash === 'string' &&
      typeof block.previousHash === 'string' &&
      typeof block.data === 'string' &&
      typeof block.timestamp === 'number';

   constructor(
      index: number,
      hash: string,
      previousHash: string,
      data: string,
      timestamp: number
   ) {
      this.index = index;
      this.hash = hash;
      this.previousHash = previousHash;
      this.data = data;
      this.timestamp = timestamp;
   }
}

const genesisBlock: Block = new Block(0, '20202020202', '', 'hello', 123456);

let blockchain: [Block] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
   const previousBlock: Block = getLatestBlock();
   const newIndex: number = previousBlock.index + 1;
   const nextTimestamp: number = getNewTimestamp();
   const nextHash: string = Block.calculateBlockHash(
      newIndex,
      previousBlock.hash,
      nextTimestamp,
      data
   );
   const newBlock: Block = new Block(
      newIndex,
      nextHash,
      previousBlock.hash,
      data,
      nextTimestamp
   );

   addBlock(newBlock);

   return newBlock;
};

const getHashForBlock = (block: Block): string =>
   Block.calculateBlockHash(
      block.index,
      block.previousHash,
      block.timestamp,
      block.data
   );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
   if (!Block.validateStructure(candidateBlock)) {
      console.log('Not Valid Structure');
      return false;
   } else if (previousBlock.index + 1 !== candidateBlock.index) {
      console.log('Not Valid Index');
      return false;
   } else if (previousBlock.hash !== candidateBlock.previousHash) {
      console.log('Not Valid PreviousHash');
      return false;
   } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
      console.log('Not Valid Hash');
      return false;
   } else {
      return true;
   }
};

const addBlock = (candidateBlock: Block): void => {
   if (isBlockValid(candidateBlock, getLatestBlock())) {
      blockchain.push(candidateBlock);
   }
};

createNewBlock('second block');
createNewBlock('third block');
createNewBlock('fourth block');
createNewBlock('fifth block');
createNewBlock('sixth block');

console.log(blockchain);

export {};
