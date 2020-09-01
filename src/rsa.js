// 加解密
const fs = require('fs')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
let keypair = ec.genKeyPair()

function getPub(prv) {
  // 根据私钥计算公钥
  return ec.keyFromPrivate(prv).getPublic('hex').toString()
}
function generateKeys() {
  const fileName = './wallet.json'
  try {
    const res = JSON.parse(fs.readFileSync(fileName))
    if (res.prv && res.pub && getPub(res.prv) === res.pub) {
      keypair = ec.keyFromPrivate(res.prv)
      return res
    } else {
      throw new Error('not valid wallet.json')
    }
  } catch (error) {
    const res = {
      prv: keypair.getPrivate('hex').toString(),
      pub: keypair.getPublic('hex').toString()
    }
    fs.writeFileSync(fileName, JSON.stringify(res))
    return res
  }
}
// 获取公钥私钥
const keys = generateKeys()
console.log(keys)
// 签名
function sign({ from, to, amount }) {
  const bufferMsg = Buffer.from(`${from}-${to}-${amount}`)
  const signature = Buffer.from(keypair.sign(bufferMsg).toDER()).toString('hex')
  return signature
}
// 校验
function verify({ from, to, amount, signature }, pub) {
  // 校验是没有私钥的
  const keypairTemp = ec.keyFromPublic(pub, 'hex')
  const bufferMsg = Buffer.from(`${from}-${to}-${amount}`)
  return keypairTemp.verify(bufferMsg, signature)
}
// const trans = { from: 'woniu', to: 'imooc', amount: 100 }
// const trans1 = { from: 'woniu', to: 'imooc', amount:100}
// const signature = sign(trans)
// trans.signature = signature
// console.log(signature)
// const isVerify = verify(trans, keys.pub)
// console.log(isVerify)
module.exports = { sign, verify, keys }
