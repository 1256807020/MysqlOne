'use strict'
const dgram = require('dgram')
// udp收信息
const udp = dgram.createSocket('udp4')
udp.on('error', (err) => {
  console.log(`服务器异常：\n${err.stack}`)
  udp.close()
})
udp.on('message', (data, remote) => {
  console.log('accept message' + data.toString())
  console.log(remote)
  console.log(`服务器收到：${data} 来自 ${remote.address}:${remote.port}`)
})
udp.on('listening', () => {
  const address = udp.address()
  console.log(`服务器监听 ${address.address}:${address.port}`)
})
// udp.bind({
//   address: 'localhost',
//   port: 3002,
//   exclusive: true
// })
udp.bind(0)
// udp发信息
function send(message
  , port, host) {
  console.log('send message', message, port, host)
  udp.send(Buffer.from(message), port, host, (err) => {
    if (err) {
      udp.close()
    }
    return true
  })
}
console.log(process.argv)
const port = Number(process.argv[2])
const host = process.argv[3]
if (port && host) {
  send('你好啊', port, host)
}
