const crypto = require("crypto");

class Block {
  constructor(index, previousHash, timestamp, data, difficulty) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        `${this.index}${this.previousHash}${this.timestamp}${JSON.stringify(this.data)}${this.nonce}`
      )
      .digest("hex");
  }

  mineBlock() {
    const prefix = "0".repeat(this.difficulty);
    while (!this.hash.startsWith(prefix)) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
  }
}

class MiniBlockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, "0", Date.now(), { genesis: true }, 1);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const prev = this.getLatestBlock();
    const block = new Block(this.chain.length, prev.hash, Date.now(), data, this.difficulty);
    block.mineBlock();
    this.chain.push(block);
    return block;
  }
}

const chain = new MiniBlockchain();
const mined = chain.addBlock({ from: "wallet1", to: "wallet2", amount: 25 });
console.log("Mined block:", mined);
console.log("Chain length:", chain.chain.length);
