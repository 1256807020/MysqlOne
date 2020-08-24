const vorpal = require('vorpal')()
const Blockchain = require('./blockchain')
const blockchain = new Blockchain()
const Table = require('cli-table')
function formatLog(data) {
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
vorpal.command('detail <index>', '查看区块详情').action(function (args, callback) {
  const block = blockchain.blockchain[args.index]
  this.log(JSON.stringify(block, null, 2))
  callback()
})
vorpal.command('trans <from> <to> <amount>', '转账').action(function (args, callback) {
  const trans = blockchain.transfer(args.from, args.to, args.amount)
  formatLog(trans)
  callback()
})
vorpal.command('mine <address>', '挖矿').action(function (args, callback) {
  const newBlock = blockchain.mine(args.address)
  if (newBlock) {
    formatLog(newBlock)
  }
  callback()
})
vorpal.command('chain', '查看区块链').action(function (args, callback) {
  formatLog(blockchain.blockchain)
  callback()
})
console.log('welcome')
vorpal.exec('help')
vorpal.delimiter('chain = >>>').show()
