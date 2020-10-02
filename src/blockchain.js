const crypto = require('crypto')
const dgram = require('dgram')
const rsa = require('./rsa')
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
    // 所有的网络节点信息，address port
    this.peers = []
    this.remote = {}
    this.newPeers = []
    this.remotePeer = {}
    this.allData = {}
    this.newChain = []
    this.lastBlock = {}
    // 种子节点
    this.seed = { port: 8001, address: 'localhost' }
    this.udp = dgram.createSocket('udp4')
    this.init()
  }

  init() {
    this.bindP2p()
    this.bindExit()
  }

  bindP2p() {
    this.udp.on('message', (data, remote) => {
      const { address, port } = remote
      const action = JSON.parse(data)
      // {
      //   type:'',
      //   data:'具体信息'
      // }
      if (action.type) {
        this.dispatch(action, { address, port })
      }
    })
    this.udp.on('listening', () => {
      const address = this.udp.address()
      console.log('[信息]：udp监听完毕，端口是：' + address.port)
    })
    // 区分种子节点和普通节点，普通节点0即可，任意空闲节点
    // 种子节点必须是预定
    console.log(process.argv)
    const port = Number(process.argv[2]) || 0
    this.startNode(port)
  }

  bindExit() {
    process.on('exit', () => {
      console.log('【信息】:网络一线牵，珍惜这段缘，再见！')
    })
  }

  startNode(port) {
    this.udp.bind(port)
    // 如果不是种子节点，需要发送一个消息给种子
    if (port !== 8001) {
      console.log(this.seed.port, this.seed.address)
      this.send({
        type: 'newpeer'
      }, this.seed.port, this.seed.address)
      // 把种子节点加入到本地节点
      this.peers.push(this.seed)
    }
  }

  send(message, port, address) {
    // console.log(message, port, address)
    this.udp.send(JSON.stringify(message), port, address)
  }

  boardcast(action) {
    // 广播全场
    this.peers.forEach(v => {
      this.send(action, v.port, v.address)
    })
  }

  dispatch(action, remote) {
    // 接收到网络消息在这里处理，判断是
    // console.log(action, remote)
    // console.log('接收到P2P网络消息', action)
    switch (action.type) {
      case 'newpeer':
        // 种子节点要做的事情
        // 1. 你的公网ip和port是啥
        this.send({
          type: 'remoteAddress',
          data: remote
        }, remote.port, remote.address)
        // 2.现在全部节点的列表
        this.send({
          type: 'peerlist',
          data: this.peers
        }, remote.port, remote.address)
        // 3.告诉所有已知节点，来了个新朋友，快打招呼
        this.boardcast({
          type: 'sayhi',
          data: remote
        })
        // 4.告诉你现在区块链的数据
        // 一定记得加地址和端口
        this.send({
          type: 'blockchain',
          data: JSON.stringify({
            blockchain: this.blockchain,
            trans: this.data
          })
        }, remote.port, remote.address)
        this.peers.push(remote)
        console.log('你好啊，新朋友', remote)
        break
      case 'blockchain':
        // 同步本地链
        this.allData = JSON.parse(action.data)
        console.log('this.allData', this.allData)
        this.newChain = this.allData.blockchain
        // eslint-disable-next-line
        const newTrans = this.allData.trans
        // console.log(this.allData)
        // if (this.newChain.length > 1) {
        this.replaceChain(this.newChain)
        this.replaceTrans(newTrans)
        // }
        break
      case 'remoteAddress':
        // 存储远程消息，退出时候用
        console.log(action.data)
        this.remote = action.data
        break
      case 'peerlist':
        // 远程告诉我，现在的节点列表
        this.newPeers = action.data
        this.addPeers(this.newPeers)
        break
      case 'sayhi':
        // eslint-disable-next-line
        this.remotePeer = action.data
        this.peers.push(this.remotePeer)
        console.log('[信息]:新朋友你好啊，相逢就是缘分')
        this.send({ type: 'hi', data: 'hi' }, this.remotePeer.port, this.remotePeer.address)
        break
      case 'hi':
        console.log(`${remote.address}:${remote.port}:${action.data}`)
        break
      case 'trans':
        // 网络上收到了交易请求
        // 是否有重复交易
        if (!this.data.find(v => this.isEqualObj(v, action.data))) {
          console.log('有新的交易，请注意查收！')
          this.addTrans(action.data)
          this.boardcast({
            type: 'trans',
            data: action.data
          })
        }
        break
      case 'mine':
        // 网络上有人挖矿成功
        this.lastBlock = this.getLastBlock()
        if (this.lastBlock.hash === action.data.hash) {
          // 重复的消息
          return
        }
        if (this.isValidBlock(action.data, this.lastBlock)) {
          console.log('[信息] 有朋友挖矿成功，让我们一起给他喝彩，放烟花！')
          this.blockchain.push(action.data)
          // 清空本地消息
          this.data = []
          this.boardcast({
            type: 'mine',
            data: action.data
          })
        } else {
          console.log('挖矿的区块不合法！')
        }
        break
      default:
        console.log('这个action不认识')
    }
  }

  // 判断两个对象是否相等
  isEqualObj(obj1, obj2) {
    const key1 = Object.keys(obj1)
    const key2 = Object.keys(obj2)
    if (key1.length !== key2.length) {
      // key数量不同
      return false
    }
    return key1.every(key => obj1[key] === obj2[key])
  }

  // isEqualPeer(peer1, peer2) {
  //   return peer1.address === peer2.address && peer1.port === peer2.port
  // }

  addPeers(peers) {
    peers.forEach(peer => {
      // 新节点如果不存在就添加一个到peers
      if (!this.peers.find(v => this.isEqualObj(peer, v))) {
        this.peers.push(peer)
      }
      // let arr=[1,2,3]
      // arr.find(v=>v>2)
      // !arr.find(v=>v>2)
      // !arr.find(v=>v>3)
    })
  }

  getLastBlock() {
    return this.blockchain[this.blockchain.length - 1]
  }

  transfer(from, to, amount) {
    // 获取当前时间戳
    const timestamp = new Date().getTime()
    // 签名,注意key值只能叫signature
    const signature = rsa.sign({ from, to, amount, timestamp })
    console.log(signature)
    // 签名后的对象和签名数据
    const sigTrans = { from, to, amount, timestamp, signature }
    // 签名校验(后面补充)
    if (from !== '0') {
      // 交易非挖矿
      const blance = this.blance(from)
      if (blance < amount) {
        console.log('not enough blance', from, blance, amount)
        return
      }
      this.boardcast({
        type: 'trans',
        data: sigTrans
      })
    }
    this.data.push(sigTrans)
    return sigTrans
  }

  // 查看余额
  blance(address) {
    let blance = 0
    this.blockchain.forEach(block => {
      if (!Array.isArray(block.data)) {
        // 创世区块链
        return
      }
      block.data.forEach(trans => {
        console.log('address', address, trans.from, trans.to)
        if (address === trans.from) {
          blance -= trans.amount
        }
        if (address === trans.to) {
          blance += trans.amount
        }
      })
    })
    console.log(blance)
    return blance
  }

  isValidTransfer(trans) {
    // 是不是合法的转账
    // 地址即使公钥
    return rsa.verify(trans, trans.from)
  }

  addTrans(trans) {
    if (this.isValidTransfer(trans)) {
      this.data.push(trans)
    }
  }

  replaceTrans(trans) {
    if (trans.every(v => this.isValidTransfer(v))) {
      this.data = trans
    }
  }

  // 挖矿 就是打包交易
  mine(address) {
    // 校验所有交易的合法性
    // 只要有不合法就报错
    // let arr = [1,2,3,4,5]
    // every校验每项是否合法
    // arr.every(v=>v<6)
    // if (!this.data.every(v => this.isValidTransfer(v))) {
    //   console.log('trans not valid')
    //   return
    // }
    // 或者过滤不合法的
    this.data = this.data.filter(v => this.isValidTransfer(v))
    // 生成新的区块，一页的记账加入新的区块
    // 不停的计算hash
    // 挖矿结束，矿工奖励100
    this.transfer('0', address, 100)
    const newBlock = this.generateNewBlock()
    console.log(newBlock)
    if (this.isValidBlock(newBlock) && this.isValidChain()) {
      this.blockchain.push(newBlock)
      this.data = []
      console.log('[消息]：挖矿成功！')
      this.boardcast({
        type: 'mine',
        data: newBlock
      })
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
  computeHashFroBlock({ index, prevHash, timestamp, data, nonce }) {
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
    } else if (newBlock.hash !== this.computeHashFroBlock(newBlock)) {
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

  replaceChain(newChain) {
    // 先不校验交易
    if (newChain.length === 1) {
      // 创世区块链
      return
    }
    if (this.isValidChain(newChain) && newChain.length > this.blockchain.length) {
      this.blockchain = JSON.parse(JSON.stringify(newChain))
    } else {
      console.log('不合法链')
    }
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
