const crypto = require('crypto')
// 创世区块链
const initBlock = {
  index: 0,
  data: 'blockchain',
  prevHash: '0',
  timestamp: 1597326496798,
  nonce: 13180,
  hash: '0000b117cba571637ded3ec50465ac8f1df16ef77b9562122ec9a78362412f67'
}
class Blockchain {
  constructor() {
    this.blockchain = [initBlock]
    this.data = []
    this.difficult = 4
    const hash = this.computeHash(0, '0', 1597326496798, 'blockchain', 1)
    console.log('创世Hash', hash)
  }

  getLastBlock() {
    return this.blockchain[this.blockchain.length - 1]
  }

  // 挖矿
  mine() {
    const newBlock = this.generateNewBlock()
    if (this.isValidBlock(newBlock) && this.isValidChain(this.blockchain)) {
      this.blockchain.push(newBlock)
      return newBlock
    } else {
      console.log('Error,Invalid Block', newBlock)
    }
  }

  // 生成新的区块
  generateNewBlock() {
    let nonce = 0
    const index = this.blockchain.length // 区块索引
    const data = this.data
    const prevHash = this.getLastBlock().hash
    const timestamp = new Date().getTime()
    let hash = this.computeHash(index, prevHash, timestamp, data, nonce)
    while (hash.slice(0, this.difficult) !== '0'.repeat(this.difficult)) {
      nonce += 1
      hash = this.computeHash(index, prevHash, timestamp, data, nonce)
    }
    console.log('生成Hash', nonce, hash)
    return { index, data, prevHash, timestamp, nonce, hash }
  }

  //
  coomputeHashFroBlock({ index, prevHash, timestamp, data, nonce }) {
    return this.computeHash(index, prevHash, timestamp, data, nonce)
  }

  // 计算哈希
  computeHash(index, prevHash, timestamp, data, nonce) {
    return crypto.createHash('sha256').update(index + prevHash + timestamp + data + nonce).digest('hex')
  }

  // 校验区块
  isValidBlock(newBlock, lastBlock = this.getLastBlock()) {
    // 区块的index等于最新区块的index+1
    // 区块的time大于最新区块
    // 最新区块的prevHash 等一最新区块的hash
    // 区块的哈希值，符合难度要求
    // 新区块的哈希值计算正确
    if (newBlock.index !== lastBlock.index + 1) {
      return false
    } else if (newBlock.timestamp <= lastBlock.timestamp) {
      return false
    } else if (newBlock.prevHash !== lastBlock.hash) {
      return false
    } else if (newBlock.hash.slice(0, this.difficulty) === '0'.repeat(this.difficult)) {
      return false
    } else if (newBlock.hash !== this.coomputeHashFroBlock(newBlock)) {
      return false
    }
    return true
  }

  // 校验区块链
  isValidChain(chain = this.blockchain) {
    for (let i = chain.length - 1; i >= 1; i = i - 1) {
      if (!this.isValidBlock(chain[i], chain[i - 1])) {
        return false
      }
    }
    if (JSON.stringify(chain[0]) !== JSON.stringify(initBlock)) {
      return false
    }
    return true
  }
}
// const bc = new Blockchain()
// bc.mine()
// 篡改值
// bc.blockchain[1].nonce = 22
// bc.mine()
// bc.mine()
// bc.mine()
// bc.mine()
// console.log(bc.blockchain)
module.exports = Blockchain
