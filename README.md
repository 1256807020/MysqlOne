# MysqlOne
#### mysql学习
cli-table 命令行表格
对称加密
非对称加密：用私钥加密，用公钥验证信息是否合法
公钥当成地址用,公钥可以通过私钥计算出来
udp协议  node   dgram自带模块来处理udp
全局广播，只为加上白名单
服务端为npm run chain 8001 端口是代码中定义的
客户端为npm run chain 

#### 区块链记账
1.每个人都有记账权利
2.每个交易都会全网广播 一起记录
3.账本每一页是一个区块
4.区块上有一个数，指向前一个区块
5.什么时候同步：挖矿（竞争获得记账权）

矿工打包的时候，会进行每个交易的合法校验
1.sig是签名校验合法
2.账号的余额够不够

1.新节点加入，同步种子节点的区块链信息
2.挖矿广播
3.交易广播
#### node.js区块链开发
```
hash -> 散列函数，数据指纹，hash命令体验
```

```
区块 
{
  index: 1,
  data: [
    {
      from: '0',
      to: '042c44ebce1595e45a52b857aad48bf48689a41a3e9da927355f8438d8afc95f5067305ce4fba2542d1c9b8d316009ec21149724a1cdea9486012ef1438aaae253',
      amount: 100,
      timestamp: 1601623865536,
      signature: '3045022034ddd6ca75d4ea7a28da2729043baef075178a989be7d7abb759f6954b200505022100d7a52b95a4dcf07a2e4d5e82c4dc66a7b1e0405f0c1646278ad9a58d7b135629'
    }
  ],
  prevHash: '0000b117cba571637ded3ec50465ac8f1df16ef77b9562122ec9a78362412f67',
  timestamp: 1601623865564,
  nonce: 42693,
  hash: '0000066bdc97379067fba318ae96688427ed61a434944f9f0ce765475cb2158e'
}
```
```
交易转账
from to amount sign签名 余额查询全部链算出金额 
```
```
非对称加密
rsa加密算法
私钥公钥加密
公钥是私钥算出来的
私钥加密，公钥验证
```
```
p2p nat打洞  udp  每个节点保存全部的peers的ip和端口
message来通知全场
```
#### 智能合约
```
区块链上面写的代码
语言是类javascript的solidity

```
```
智能合约 官方学习编译器
remix  http://remix.hubwiz.com/#optimize=false&version=soljson-v0.5.1+commit.c8a2cb62.js
https://metamask.io/
```
```
密码：wsx...rfv
私密备份密语：report guess crouch subject veteran hidden display roof negative pepper enable naive
```


















