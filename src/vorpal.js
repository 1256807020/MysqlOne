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
    return head.map(h => v[h])
  })
  table.push(...res)
  console.log(table.toString())
}
vorpal.command('mine', '挖矿').action(function (args, callback) {
  const newBlock = blockchain.mine()
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
