const vorpal = require('vorpal')()
const Blockchain = require('./blockchain')
const rsa = require('./rsa')
const blockchain = new Blockchain()
const Table = require('cli-table')
function formatLog(data) {
  if (!data || data.length === 0) {
    return
  }
  if (!Array.isArray(data)) {
    data = [data]
  }
  const first = data[0]
  const head = Object.keys(first)
  const table = new Table({
    head: head,
    colWidths: new Array(head.length).fill(20)
  })
  const res = data.map(v => {
    return head.map(h => JSON.stringify(v[h], null, 1))
  })
  table.push(...res)
  console.log(table.toString())
}
vorpal.command('blance <address>', '查看余额').action(function (args, callback) {
  const blance = blockchain.blance(args.address)
  if (blance) {
    formatLog({ blance, address: args.address })
  } else {

  }
  callback()
})
vorpal.command('detail <index>', '查看区块详情').action(function (args, callback) {
  const block = blockchain.blockchain[args.index]
  this.log(JSON.stringify(block, null, 2))
  callback()
})
vorpal.command('trans <to> <amount>', '转账').action(function (args, callback) {
  // 本地公钥当做转出地址
  const trans = blockchain.transfer(rsa.keys.pub, args.to, args.amount)
  if (trans) {
    formatLog(trans)
  }
  callback()
})
vorpal.command('mine', '挖矿').action(function (args, callback) {
  // const newBlock = blockchain.mine(args.address)
  // 挖矿给本地自己挖
  const newBlock = blockchain.mine(rsa.keys.pub)
  if (newBlock) {
    formatLog(newBlock)
  }
  callback()
})
vorpal.command('chain', '查看区块链').action(function (args, callback) {
  formatLog(blockchain.blockchain)
  callback()
})
vorpal.command('pub', '查看本地地址').action(function (args, callback) {
  console.log(rsa.keys.pub)
  callback()
})
vorpal.command('peers', '查看网络节点列表').action(function (args, callback) {
  formatLog(blockchain.peers)
  callback()
})
vorpal.command('chat <msg>', '跟别的节点hi一下').action(function (args, callback) {
  blockchain.boardcast({
    type: 'hi',
    data: args.msg
  })
  callback()
})
vorpal.command('pedding', '查看还没被打包的交易').action(function (args, callback) {
  formatLog(blockchain.data)
  callback()
})
// console.log('welcome')
vorpal.exec('help')
vorpal.delimiter('chain = >>>').show()
