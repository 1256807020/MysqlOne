const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const keypair = ec.genKeyPair()
const res = {
  prv: keypair.getPrivate('hex').toString(),
  pub: keypair.getPublic('hex').toString()
}
console.log(res)
